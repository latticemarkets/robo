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

  def linesToLCL(loansStr: Seq[String]): Seq[LCL] = {
    loansStr
      .filter(line => {
        val split: Array[String] = line.split(",")
        split(0).length != 0 && split(66).length != 0
      })
      .map (line => {
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

  def select(initialLoans: Seq[LCL], weights: Seq[Double], term: Int, startingDate: String, portfolioSize: Int): Array[LCL] = {
    val filtered = initialLoans.filter(loan => loan.term == term && !dateAfter(startingDate, loan.issuedMonth) && dateAfter(startingDate, loan.lastPaymentMonth))
    val grades = filtered groupBy (_.grade)
    val weightedLoans = grades.flatMap { case (g, l) => l.take((weights(indexToGrade.indexOf(g)) * portfolioSize.toDouble).toInt) }
    Random.shuffle(Random.shuffle(Random.shuffle(weightedLoans))).toArray
  }

  def experiment(nbInstances: Int, inputFile: String, weights: Seq[Double], term: Int, startingDate: String, portfolioSize: Int, noteSize: BigDecimal): ExperimentResult = {
    val iteratedDatesStr = intListToStrMonths(MonthDate(startingDate), (- term) until term * 2)

    val initialLoans = linesToLCL(Source.fromFile(new File(inputFile)).getLines.toSeq.drop(1).reverse)
    var loansInPortfolio = select(initialLoans, weights, term, startingDate, portfolioSize)

    val portfolioActualWeights = Seq(0, 0, 0, 0, 0, 0, 0)
    var portfolioBalance: BigDecimal = 0


    def simulateOneMonth(currentMonth: Int): MonthlyResult = {
      def endsThisMonth: (LCL) => Boolean = {
        l => iteratedDatesStr.indexOf(l.lastPaymentMonth) - term == currentMonth
      }

      def prepaid(l: LCL): Boolean = {
        endsThisMonth(l) && iteratedDatesStr.indexOf(l.lastPaymentMonth) - iteratedDatesStr.indexOf(l.issuedMonth) != term
      }

      val endedThisMonth: Array[LCL] = loansInPortfolio.filter(endsThisMonth)
      val defaultedThisMonth: Array[LCL] = endedThisMonth.filter(l => defaultStates.contains(l.state))

      // compute the defaults of this currentMonth
      val defaults = defaultedThisMonth.map(l => noteSize - monthlyInterest(l, term, noteSize) * (currentMonth + 1)).sum
      // compute the interests for this currentMonth
      val interests = loansInPortfolio.map(l => {
        if (prepaid(l)) {
          l.lastPaymentAmount * noteSize / l.fundedAmount
        }
        else {
          monthlyInterest(l, term, noteSize)
        }
      }).sum

      // remove matured and defaulted from the list of loans
      loansInPortfolio = loansInPortfolio.filter(!endsThisMonth(_))

      portfolioBalance = portfolioBalance + interests
      MonthlyResult(interests, defaults, loansInPortfolio.length)
    }


    // run the simulation on ${term} months
    val resultsByMonth: Seq[MonthlyResult] = (0 until term) map (currentMonth => simulateOneMonth(currentMonth))

    // continue the simulation without reinvesting to get the outstanding interests
    var outstandingInterest: BigDecimal = 0
    var currentMonth = term

    while (loansInPortfolio.length > 0) {
      val month: MonthlyResult = simulateOneMonth(currentMonth)
      outstandingInterest = outstandingInterest + month.interests - month.defaults
      currentMonth = currentMonth + 1
    }

    // output
    ExperimentResult(
      interestPaid = resultsByMonth map (_.interests) sum,
      capitalLost = resultsByMonth map (_.defaults) sum,
      ratioLost = (resultsByMonth map (_.defaults) sum) / (resultsByMonth map (_.interests) sum),
      outstandingInterest = outstandingInterest
    )
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

def main(args: Array[String]): Unit = {
    val inputFile =  "/Users/julienderay/Lattice/csvPreprocessor/main/preprocessedCSV.csv"

    val nbInstances = 1000
    val weights = Seq(1d, 0d, 0d, 0d, 0d, 0d, 0d)
    val term = 36
    val startingDate = "Jan-10"
    val portfolioSize = 1000
    val noteSize = 25

    val res = experiment(nbInstances, inputFile, weights, term, startingDate, portfolioSize, noteSize)
    println("interestPaid", res.interestPaid)
    println("capitalLost", res.capitalLost)
    println("ratioLost", res.ratioLost)
    println("outstandingInterest", res.outstandingInterest)
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
                             outstandingInterest: BigDecimal)