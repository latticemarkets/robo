/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.pdx.insurance

import java.io.File

import scala.io.Source
import scala.util.Random

/**
  * @author : julienderay
  * Created on 09/03/2016
  */
object Simulations  {

  val indexToGrade = Seq("A", "B", "C", "D", "E", "F", "G")
  val defaultStates = Set("Charged Off", "Default", "In Grace Period", "Late (16-30 days)", "Late (16-30 days)", "Late (31-120 days)")

  def main(args: Array[String]): Unit = {
    val inputFile =  "/Users/julienderay/Lattice/csvPreprocessor/main/preprocessedCSV.csv"

    val nbInstances = 1000
    val weights = Seq(1d, 0d, 0d, 0d, 0d, 0d, 0d)
    val term = 36
    val startingDate = "Jan-10"
    val portfolioSize = 1000
    val noteSize = 25

    val res: ExperimentResult = experiment(nbInstances, inputFile, weights, term, startingDate, portfolioSize, noteSize)

    printResult(res)
  }

  def experiment(nbInstances: Int, inputFile: String, weights: Seq[Double], term: Int, startingDate: String, portfolioSize: Int, noteSize: BigDecimal): ExperimentResult = {
    val iteratedDatesStr = intListToStrMonths(MonthDate(startingDate), (- term) until term * 2)

    val lines: Seq[String] = Source.fromFile(new File(inputFile)).getLines.toSeq
    var initialLoans = linesToLCL(lines.drop(1).reverse, lines.head)
    val loansInPortfolio = select(initialLoans, weights, term, startingDate, portfolioSize)
    initialLoans = Random.shuffle(Random.shuffle(Random.shuffle(
      initialLoans.filterNot(loansInPortfolio.toSet)
    )))

    val portfolioActualWeights = weights.map(_ * portfolioSize).zipWithIndex
    val portfolioBalance: BigDecimal = 0
    val firstInvestment: BigDecimal = portfolioSize * noteSize

    // run the simulation on ${term} months
    val resultsByMonth: Seq[MonthlyResult] = simulateThePeriod(0, iteratedDatesStr, term, noteSize, portfolioSize, initialLoans, loansInPortfolio, portfolioBalance, portfolioActualWeights, weights, Seq[MonthlyResult]())

    // continue the simulation without reinvesting to get the outstanding interests
    val outstandingInterest = computeOutstandingInterests(0, iteratedDatesStr, term, noteSize, loansInPortfolio, BigDecimal(0))

    // output
    ExperimentResult(
      interestPaid = resultsByMonth map (_.interests) sum,
      capitalLost = resultsByMonth map (_.defaults) sum,
      ratioLost = (resultsByMonth map (_.defaults) sum) / (resultsByMonth map (_.interests) sum),
      outstandingInterest = outstandingInterest,
      details = resultsByMonth,
      investment = (resultsByMonth map (_.investment) sum) + firstInvestment
    )
  }

  def select(initialLoans: Seq[LCL], weights: Seq[Double], term: Int, startingDate: String, portfolioSize: Int): Array[LCL] = {
    val filtered = initialLoans.filter(loan => loan.term == term && !dateAfter(startingDate, loan.issuedMonth) && dateAfter(startingDate, loan.lastPaymentMonth))
    val grades = filtered groupBy (_.grade)
    grades.flatMap { case (g, l) => l.take((weights(indexToGrade.indexOf(g)) * portfolioSize.toDouble).toInt) }.toArray
  }

  def computeOutstandingInterests(currentMonth: Int,
                                  iteratedDatesStr: Seq[String],
                                  term: Int,
                                  noteSize: BigDecimal,
                                  loansInPortfolio: Seq[LCL],
                                  outstandingInterest: BigDecimal): BigDecimal = {

    val endedThisMonth: Seq[LCL] = filterLoansEndedThisMonth(currentMonth, iteratedDatesStr, term, loansInPortfolio)
    val defaultedThisMonth: Seq[LCL] = filterLoansDefaultedThisMonth(endedThisMonth)

    val defaults = computeDefaults(currentMonth, noteSize, defaultedThisMonth)
    val interests = computeInterests(currentMonth, iteratedDatesStr, term, noteSize, loansInPortfolio)
    val newLoansInPortfolio = filterMaturedAndDefaultedLoans(currentMonth, iteratedDatesStr, term, loansInPortfolio)

    val thisMonthOutstandingInterest = outstandingInterest + interests - defaults

    if (loansInPortfolio.nonEmpty) {
      computeOutstandingInterests(currentMonth + 1, iteratedDatesStr, term, noteSize, newLoansInPortfolio, thisMonthOutstandingInterest)
    }
    else {
      thisMonthOutstandingInterest
    }
  }

  def simulateThePeriod(currentMonth: Int,
                        iteratedDatesStr: Seq[String],
                        term: Int,
                        noteSize: BigDecimal,
                        portfolioSize: Int,
                        loansList: Seq[LCL],
                        loansInPortfolio: Seq[LCL],
                        portfolioBalance: BigDecimal,
                        portfolioActualWeights: Seq[(Double, Int)],
                        goalWeights: Seq[Double],
                        monthlyResults: Seq[MonthlyResult]): Seq[MonthlyResult] = {

    println(s"Simulating month : $currentMonth")

    val endedThisMonth: Seq[LCL] = filterLoansEndedThisMonth(currentMonth, iteratedDatesStr, term, loansInPortfolio)
    val defaultedThisMonth: Seq[LCL] = filterLoansDefaultedThisMonth(endedThisMonth)

    val defaults = computeDefaults(currentMonth, noteSize, defaultedThisMonth)
    val interests = computeInterests(currentMonth, iteratedDatesStr, term, noteSize, loansInPortfolio)
    var newLoansInPortfolio = filterMaturedAndDefaultedLoans(currentMonth, iteratedDatesStr, term, loansInPortfolio)

    // update portfolio balance
    var newPortfolioBalance = portfolioBalance + interests

    // update actual weights
    var newPortfolioActualWeights = updateWeights(portfolioActualWeights, endedThisMonth)

    var newLoansList = loansList
    var newInvestments: BigDecimal = 0

    // replay the interests earned
    if (portfolioBalance > noteSize && newLoansInPortfolio.size < portfolioSize) {
      val loansToInvestOn = getLoansToInvestOn(loansList, noteSize, goalWeights, portfolioActualWeights, portfolioBalance, iteratedDatesStr(currentMonth + term + 1), portfolioSize, newLoansInPortfolio.size)
      newInvestments = noteSize * loansToInvestOn.size
      newLoansInPortfolio = newLoansInPortfolio ++ loansToInvestOn
      newPortfolioActualWeights = updateWeights(portfolioActualWeights, loansToInvestOn)
      newPortfolioBalance = portfolioBalance - loansToInvestOn.size * noteSize
      newLoansList = loansList.filterNot(loansToInvestOn.toSet)
    }

    val thisMonthResult = MonthlyResult(interests, defaults, newLoansInPortfolio.length, newInvestments)
    if (currentMonth < term) {
      simulateThePeriod(currentMonth + 1, iteratedDatesStr, term, noteSize, portfolioSize, newLoansList, newLoansInPortfolio, newPortfolioBalance, newPortfolioActualWeights, goalWeights, monthlyResults :+ thisMonthResult)
    }
    else {
      monthlyResults :+ thisMonthResult
    }
  }

  def filterMaturedAndDefaultedLoans(currentMonth: Int, iteratedDatesStr: Seq[String], term: Int, loansInPortfolio: Seq[LCL]): Seq[LCL] = {
    loansInPortfolio.filter(l => !endsThisMonth(iteratedDatesStr, term, currentMonth, l))
  }

  def computeInterests(currentMonth: Int, iteratedDatesStr: Seq[String], term: Int, noteSize: BigDecimal, loansInPortfolio: Seq[LCL]): BigDecimal = {
    loansInPortfolio.map(l => {
      if (prepaid(iteratedDatesStr, term, currentMonth, l)) {
        l.lastPaymentAmount * noteSize / l.fundedAmount
      }
      else {
        monthlyInterest(l, noteSize)
      }
    }).sum
  }

  def computeDefaults(currentMonth: Int, noteSize: BigDecimal, defaultedThisMonth: Seq[LCL]): BigDecimal = {
    defaultedThisMonth.map(l => noteSize - monthlyInterest(l, noteSize) * (currentMonth + 1)).sum
  }

  def filterLoansDefaultedThisMonth(endedThisMonth: Seq[LCL]): Seq[LCL] = {
    endedThisMonth.filter(l => defaultStates.contains(l.state))
  }

  def filterLoansEndedThisMonth(currentMonth: Int, iteratedDatesStr: Seq[String], term: Int, loansInPortfolio: Seq[LCL]): Seq[LCL] = {
    loansInPortfolio.filter(l => endsThisMonth(iteratedDatesStr, term, currentMonth, l))
  }

  def prepaid(iteratedDatesStr: Seq[String], term: Int, currentMonth: Int, l: LCL): Boolean = {
    endsThisMonth(iteratedDatesStr, term, currentMonth, l) && iteratedDatesStr.indexOf(l.lastPaymentMonth) - iteratedDatesStr.indexOf(l.issuedMonth) != term
  }

  def endsThisMonth(iteratedDatesStr: Seq[String], term: Int, currentMonth: Int, loan: LCL): Boolean = {
    iteratedDatesStr.indexOf(loan.lastPaymentMonth) - term == currentMonth
  }

  def updateWeights(portfolioActualWeights: Seq[(Double, Int)], loanList: Seq[LCL]): Seq[(Double, Int)] = {
    portfolioActualWeights.map { case (weight, index) => (weight - loanList.count(l => indexToGrade.indexOf(l.grade) == index), index) }
  }

  def getLoansToInvestOn(initialLoans: Seq[LCL], noteSize: BigDecimal, weightsGoals: Seq[Double], portfolioActualWeights: Seq[(Double, Int)], portfolioBalance: BigDecimal, currentMonth: String, portfolioSize: Int, actualPortfolioSize: Int) = {
    val howManyInvestments: Int = Seq((portfolioBalance / noteSize).toInt, portfolioSize - actualPortfolioSize).min
    var fundedValues: Seq[BigDecimal] = Seq()
    (0 until howManyInvestments).map(_ => {
      val gradeToInvestOn: String = indexToGrade(portfolioActualWeights.map{ case (w, i) => (weightsGoals(i) - w, i) }.sortBy(_._1).head._2)
      val loanToInvestOn = initialLoans.find(l => l.grade == gradeToInvestOn && !fundedValues.contains(l.fundedAmount) && dateAfter(currentMonth, l.lastPaymentMonth)).get
      fundedValues = fundedValues :+ loanToInvestOn.fundedAmount
      loanToInvestOn
    })
  }

  def monthlyInterest(loan: LCL, noteSize: BigDecimal): BigDecimal = loan.installment * noteSize / loan.fundedAmount

  def intListToStrMonths(parsedStartingDate: MonthDate, intList: Seq[Int]): Seq[String] = {
    intList map (month => {
      val monthNb: Int = (parsedStartingDate.month - 1 + month) % 12
      val monthStr = if (monthNb >= 0) MonthDate.monthsList(monthNb) else MonthDate.monthsList(monthNb + 12)

      val year = if (monthNb >= 0) ((parsedStartingDate.month - 1 + month) / 12) + parsedStartingDate.year
                 else ((parsedStartingDate.month + month) / 12) + parsedStartingDate.year - 1

      s"$monthStr-${if (year.toString.length > 1) year else s"0$year"}"
    })
  }

  def linesToLCL(loansStr: Seq[String], columns: String): Seq[LCL] = {
    val splitColumns: Map[String, Int] = columns.split(",").zipWithIndex.map{ case (col, index) => col -> index }.toMap

    loansStr
      .filter(line => {
        val split: Array[String] = line.split(",")
        split(splitColumns("funded_amnt")).length != 0 && split(splitColumns("last_pymnt_d")).length != 0
      })
      .map(line => {
        val fields = line.split(",")
        LCL(
          fundedAmount = BigDecimal(fields(splitColumns("funded_amnt"))),
          term = Integer.parseInt(fields(splitColumns("term")).trim.split(" ").head),
          intRate = fields(splitColumns("int_rate")).dropRight(1).toDouble,
          installment = BigDecimal(fields(splitColumns("installment"))),
          grade = indexToGrade(Seq(
            fields(splitColumns("grade_A")),
            fields(splitColumns("grade_B")),
            fields(splitColumns("grade_C")),
            fields(splitColumns("grade_D")),
            fields(splitColumns("grade_E")),
            fields(splitColumns("grade_F")),
            fields(splitColumns("grade_G"))
          ).indexOf("1")),
          issuedMonth = fields(splitColumns("issue_d")),
          state = fields(splitColumns("loan_status")),
          outstandingPrincipal = BigDecimal(fields(splitColumns("out_prncp_inv"))),
          totalPaid = BigDecimal(fields(splitColumns("total_pymnt_inv"))),
          paidPrincipal = BigDecimal(fields(splitColumns("total_rec_prncp"))),
          paidInterest = BigDecimal(fields(splitColumns("total_rec_int"))),
          lateFees = BigDecimal(fields(splitColumns("total_rec_late_fee"))),
          recoveries = BigDecimal(fields(splitColumns("recoveries"))),
          recoveryFees = BigDecimal(fields(splitColumns("collection_recovery_fee"))),
          lastPaymentMonth = fields(splitColumns("last_pymnt_d")),
          lastPaymentAmount = BigDecimal(fields(splitColumns("last_pymnt_amnt")))
        )
      })
  }

  def dateAfter(startingDate: String, issuedMonth: String): Boolean = {
    val parsedStartingDate = MonthDate(startingDate)
    val parsedLoanDate = MonthDate(issuedMonth)

    if (parsedLoanDate.year > parsedStartingDate.year) {
      true
    }
    else {
      if (parsedLoanDate.year == parsedStartingDate.year) {
        parsedLoanDate.month >= parsedStartingDate.month
      }
      else {
        false
      }
    }
  }

  def printResult(res: ExperimentResult): Unit = {
    println("=============\nDetails per month :")
    res.details.zipWithIndex.foreach { case (monthlyResult, index) =>
      println("==============")
      println(s"Month #$index")
      println(s"Interests : ${monthlyResult.interests}")
      println(s"Defaults : ${monthlyResult.defaults}")
      println(s"Portfolio Size : ${monthlyResult.portfolioSize}")
      println(s"Investment : ${monthlyResult.investment}")
    }

    println("=============\nGlobal results:")
    println(s"Interest Paid : ${res.interestPaid}")
    println(s"Capital Lost : ${res.capitalLost}")
    println(s"Capital / Interest : ${res.ratioLost}")
    println(s"Outstanding Interest : ${res.outstandingInterest}")
    println(s"Investment : ${res.investment}")
    println(s"Total : Interests + Outstanding Interest - Capital Lost - Investment : ${res.interestPaid + res.outstandingInterest - res.capitalLost - res.investment}")
    println(s"Total / Investment : ${(res.interestPaid + res.outstandingInterest - res.capitalLost - res.investment) / res.investment}")
  }
}

case class MonthDate(month: Int, year: Int)
object MonthDate {
  val monthsList = Seq("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")

  def apply(str: String): MonthDate = {
    val split = str.split("-")
    MonthDate(monthsList.indexOf(split(0)) + 1, split(1).toInt)
  }
}

case class LCL(
                fundedAmount: BigDecimal,
                issuedMonth: String,
                term: Int,
                intRate: Double,
                installment: BigDecimal,
                grade: String,
                state: String,
                outstandingPrincipal: BigDecimal,
                totalPaid: BigDecimal,
                paidPrincipal: BigDecimal,
                paidInterest: BigDecimal,
                lateFees: BigDecimal,
                recoveries: BigDecimal,
                recoveryFees: BigDecimal,
                lastPaymentMonth: String,
                lastPaymentAmount: BigDecimal)

case class MonthlyResult(
                          interests: BigDecimal,
                          defaults: BigDecimal,
                          portfolioSize: Int,
                          investment: BigDecimal)

case class ExperimentResult(
                             interestPaid: BigDecimal,
                             capitalLost: BigDecimal,
                             ratioLost: BigDecimal,
                             outstandingInterest: BigDecimal,
                             details: Seq[MonthlyResult],
                             investment: BigDecimal)