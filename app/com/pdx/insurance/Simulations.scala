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

    var initialLoans = linesToLCL(Source.fromFile(new File(inputFile)).getLines.toSeq.drop(1).reverse)
    val loansInPortfolio = select(initialLoans, weights, term, startingDate, portfolioSize)
    initialLoans = Random.shuffle(Random.shuffle(Random.shuffle(
      initialLoans.filterNot(loansInPortfolio.toSet)
    )))

    val portfolioActualWeights = weights.map(_ * portfolioSize).zipWithIndex
    val portfolioBalance: BigDecimal = 0

    // run the simulation on ${term} months
    val resultsByMonth: Seq[MonthlyResult] = simulateThePeriod(0, iteratedDatesStr, term, noteSize, initialLoans, loansInPortfolio, portfolioBalance, portfolioActualWeights, weights, Seq[MonthlyResult]())

    // continue the simulation without reinvesting to get the outstanding interests
    val outstandingInterest = computeOutstandingInterests(0, iteratedDatesStr, term, noteSize, loansInPortfolio, BigDecimal(0))

    // output
    ExperimentResult(
      interestPaid = resultsByMonth map (_.interests) sum,
      capitalLost = resultsByMonth map (_.defaults) sum,
      ratioLost = (resultsByMonth map (_.defaults) sum) / (resultsByMonth map (_.interests) sum),
      outstandingInterest = outstandingInterest,
      details = resultsByMonth
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

    val defaults = computeDefaults(currentMonth, term, noteSize, defaultedThisMonth)
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
                        loansList: Seq[LCL],
                        loansInPortfolio: Seq[LCL],
                        portfolioBalance: BigDecimal,
                        portfolioActualWeights: Seq[(Double, Int)],
                        goalWeights: Seq[Double],
                        monthlyResults: Seq[MonthlyResult]): Seq[MonthlyResult] = {

    println(s"Simulating month : $currentMonth")

    val endedThisMonth: Seq[LCL] = filterLoansEndedThisMonth(currentMonth, iteratedDatesStr, term, loansInPortfolio)
    val defaultedThisMonth: Seq[LCL] = filterLoansDefaultedThisMonth(endedThisMonth)

    val defaults = computeDefaults(currentMonth, term, noteSize, defaultedThisMonth)
    val interests = computeInterests(currentMonth, iteratedDatesStr, term, noteSize, loansInPortfolio)
    var newLoansInPortfolio = filterMaturedAndDefaultedLoans(currentMonth, iteratedDatesStr, term, loansInPortfolio)

    // update portfolio balance
    var newPortfolioBalance = portfolioBalance + interests

    // update actual weights
    var newPortfolioActualWeights = updateWeights(portfolioActualWeights, endedThisMonth)

    var newLoansList = loansList

    // replay the interests earned
    if (portfolioBalance > noteSize) {
      val loansToInvestOn = getLoansToInvestOn(loansList, noteSize, goalWeights, portfolioActualWeights, portfolioBalance, iteratedDatesStr(currentMonth + term + 1))
      newLoansInPortfolio = loansInPortfolio ++ loansToInvestOn
      newPortfolioActualWeights = updateWeights(portfolioActualWeights, loansToInvestOn)
      newPortfolioBalance = portfolioBalance - loansToInvestOn.size * noteSize
      newLoansList = loansList.filterNot(loansToInvestOn.toSet)
    }

    val thisMonthResult = MonthlyResult(interests, defaults, loansInPortfolio.length)
    if (currentMonth < term) {
      simulateThePeriod(currentMonth + 1, iteratedDatesStr, term, noteSize, newLoansList, newLoansInPortfolio, newPortfolioBalance, newPortfolioActualWeights, goalWeights, monthlyResults :+ thisMonthResult)
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
        monthlyInterest(l, term, noteSize)
      }
    }).sum
  }

  def computeDefaults(currentMonth: Int, term: Int, noteSize: BigDecimal, defaultedThisMonth: Seq[LCL]): BigDecimal = {
    defaultedThisMonth.map(l => noteSize - monthlyInterest(l, term, noteSize) * (currentMonth + 1)).sum
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

  def getLoansToInvestOn(initialLoans: Seq[LCL], noteSize: BigDecimal, weightsGoals: Seq[Double], portfolioActualWeights: Seq[(Double, Int)], portfolioBalance: BigDecimal, currentMonth: String) = {
    val howManyInvestments: Int = (portfolioBalance / noteSize).toInt
    var fundedValues: Seq[BigDecimal] = Seq()
    (0 until howManyInvestments).map(_ => {
      val gradeToInvestOn: String = indexToGrade(portfolioActualWeights.map{ case (w, i) => (weightsGoals(i) - w, i) }.sortBy(_._1).head._2)
      val loanToInvestOn = initialLoans.find(l => l.grade == gradeToInvestOn && !fundedValues.contains(l.fundedAmount) && dateAfter(currentMonth, l.lastPaymentMonth)).get
      fundedValues = fundedValues :+ loanToInvestOn.fundedAmount
      loanToInvestOn
    })
  }

  def monthlyInterest(loan: LCL, term: Int, noteSize: BigDecimal): BigDecimal = loan.installment * noteSize / loan.fundedAmount

  def intListToStrMonths(parsedStartingDate: MonthDate, intList: Seq[Int]): Seq[String] = {
    intList map (month => {
      val monthNb: Int = (parsedStartingDate.month - 1 + month) % 12
      val monthStr = if (monthNb >= 0) MonthDate.monthsList(monthNb) else MonthDate.monthsList(monthNb + 12)

      val year = if (monthNb >= 0) ((parsedStartingDate.month - 1 + month) / 12) + parsedStartingDate.year
                 else ((parsedStartingDate.month + month) / 12) + parsedStartingDate.year - 1

      s"$monthStr-${if (year.toString.length > 1) year else s"0$year"}"
    })
  }

  def linesToLCL(loansStr: Seq[String]): Seq[LCL] = {
    loansStr
      .filter(line => {
        val split: Array[String] = line.split(",")
        split(0).length != 0 && split(66).length != 0
      })
      .map(line => {
        val fields = line.split(",")
        LCL(
          fundedAmount = BigDecimal(fields(0)),
          term = Integer.parseInt(fields(1).trim.split(" ").head),
          intRate = fields(2).dropRight(1).toDouble,
          installment = BigDecimal(fields(3)),
          grade = indexToGrade(Seq(fields(4), fields(5), fields(6), fields(7), fields(8), fields(9), fields(10)).indexOf("1")),
          issuedMonth = fields(22),
          state = fields(23),
          outstandingPrincipal = BigDecimal(fields(59)),
          totalPaid = BigDecimal(fields(60)),
          paidPrincipal = BigDecimal(fields(61)),
          paidInterest = BigDecimal(fields(62)),
          lateFees = BigDecimal(fields(63)),
          recoveries = BigDecimal(fields(64)),
          recoveryFees = BigDecimal(fields(65)),
          lastPaymentMonth = fields(66),
          lastPaymentAmount = BigDecimal(fields(67))
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
      println(s"PortfolioSize : ${monthlyResult.portfolioSize}")
    }

    println("=============\nGlobal results:")
    println(s"Interest Paid : ${res.interestPaid}")
    println(s"Capital Lost : ${res.capitalLost}")
    println(s"Capital / Interest : ${res.ratioLost}")
    println(s"Outstanding Interest : ${res.outstandingInterest}")
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
                          portfolioSize: Int)

case class ExperimentResult(
                             interestPaid: BigDecimal,
                             capitalLost: BigDecimal,
                             ratioLost: BigDecimal,
                             outstandingInterest: BigDecimal,
                             details: Seq[MonthlyResult])