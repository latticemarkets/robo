/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.pdx.insurance.simulations

import java.time.LocalDate

import scala.util.Try

/**
  * @author : julienderay
  *         Created on 24/03/2016
  */
object SimulationUtils {
//  val LCInputFile = "/Users/ze97286/Downloads/preprocessed.csv"
  val LCInputFile = "/Users/julienderay/Lattice/csvPreprocessor/main/preprocessedCSV.csv"

  val LCAllAWeights = Seq(1d, 0d, 0d, 0d, 0d, 0d, 0d)
  val LCConservativeWeights = Seq(0.981d, 0.019d, 0d, 0d, 0d, 0d, 0d)
  val LCModerateWeights = Seq(0.01d, 0.52d, 0.08d, 0.238d, 0.118d, 0.031d, 0d)
  val LCAggressiveWeights = Seq(0d, 0d, 0.17d, 0.507d, 0.251d, 0.066d, 0d)

  val IndexToGrade = Seq("A", "B", "C", "D", "E", "F", "G")
  val DefaultStates = Set("Charged Off", "Default", "In Grace Period", "Late (16-30 days)", "Late (16-30 days)", "Late (31-120 days)")

  val Accuracy = 0.000001d
  val LossRate = 1d

  val LowInsuranceFactor = 0.05d
  val MedInsuranceFactor = 0.08d
  val HighInsuranceFactor = 0.12d


  // translate month to LC format
  implicit def localDateToLoanMonthFormat(ld: LocalDate): String = ld.getMonth.toString.take(3) + "-" + ld.getYear.toString.drop(2)

  private def calculateIrrFor(guess: Double, values: Seq[Double]): Double = {
    var fValue = 0.0
    var fDerivative = 0.0
    for (i <- values.indices) {
      fValue += values(i) / Math.pow(1.0 + guess, i)
      fDerivative += -i * values(i) / Math.pow(1.0 + guess, i + 1)
    }
    fValue / fDerivative
  }

  def irr(absoluteAccuracy: Double, values: Seq[Double]): Double = {
    val maxIterationCount = 100000
    var guess = 0.05
    for (i <- 0 until maxIterationCount) {
      val result = calculateIrrFor(guess, values)
      if (Math.abs(result) <= absoluteAccuracy) {
        return 100d * (Math.pow(guess - result + 1, 12) - 1)
      }
      guess = guess - result
    }
    Double.NaN
  }

  def weighted[T](weights:Seq[Double], noPortfolios:Int, seq:Seq[T]) = weights.zipWithIndex flatMap { case (weight, i) => Seq.fill((noPortfolios * weight).toInt)(seq(i)) }

  def simulateThePeriod(loans: Array[Loan],
                        startingDate: LocalDate,
                        duration: Int,
                        initialBalance: BigDecimal,
                        noteSize: BigDecimal,
                        weights: Seq[Double],
                        insuranceFactor: Double,
                        portfolio: Seq[Loan]): Seq[MonthlyResult] = {

    var portfolioVar = portfolio
    var balance = initialBalance - noteSize * BigDecimal(portfolio.size)

    // advance the simulation one month at a time
    1 to duration + 1 map (i => {
      val currentMonth = startingDate.plusMonths(i)
      val currentMonthAsString = localDateToLoanMonthFormat(currentMonth)

      // find loans that ended this month
      val (loansEndedThisMonth, continuingLoans) = portfolio.partition(_.lastPaymentMonth.equalsIgnoreCase(currentMonthAsString))

      // find how much was paid from loans ending this month
      val incomeFromLoansEndedThisMonth = loansEndedThisMonth.map(x => Math.max(0, (noteSize * (x.totalPaid - (i - 1) * x.installment) / x.fundedAmount).doubleValue)).sum

      // find how much was paid from continuing loans
      val incomeFromLoansContinuing = continuingLoans.map(x => noteSize * x.installment / x.fundedAmount).sum

      // update balance
      balance += incomeFromLoansEndedThisMonth + incomeFromLoansContinuing

      val defaultedThisMonth = loansEndedThisMonth filter (x => DefaultStates.contains(x.state))

      // calculate losses from defaults
      val lossFromDefaultsThisMonth = defaultedThisMonth.map(x => LossRate * Math.max(0, (x.fundedAmount - x.totalPaid - x.recoveries).doubleValue) * noteSize / x.fundedAmount).sum

      val mr = MonthlyResult(currentMonth, portfolioVar, incomeFromLoansEndedThisMonth + incomeFromLoansContinuing, lossFromDefaultsThisMonth, balance, insuranceFactor)
      portfolioVar = continuingLoans //++ newLoans
      mr
    })
  }

  def linesToLoan(loansStr: Seq[String], columns: String): Seq[Loan] = {
    val splitColumns = columns.split(",").zipWithIndex.toMap
    loansStr.map(line => {
      val fields = line.split(",")
      val fundedAmount = Try(BigDecimal(fields(splitColumns("funded_amnt")))).getOrElse(BigDecimal(0))
      val issuedMonth = fields(splitColumns("issue_d"))
      val term = Try(Integer.parseInt(fields(splitColumns("term")).trim.split(" ").head)).getOrElse(0)
      val intRate = Try(fields(splitColumns("int_rate")).dropRight(1).toDouble).getOrElse(0d)
      val installment = Try(BigDecimal(fields(splitColumns("installment")))).getOrElse(BigDecimal(0))
      val grade = Try(IndexToGrade(Seq(
        fields(splitColumns("grade_A")),
        fields(splitColumns("grade_B")),
        fields(splitColumns("grade_C")),
        fields(splitColumns("grade_D")),
        fields(splitColumns("grade_E")),
        fields(splitColumns("grade_F")),
        fields(splitColumns("grade_G"))).indexOf("1"))).getOrElse("NA")
      val state = fields(splitColumns("loan_status"))
      val paidPrincipal = Try(BigDecimal(fields(splitColumns("total_rec_prncp")))).getOrElse(BigDecimal(0))
      val paidInterest = Try(BigDecimal(fields(splitColumns("total_rec_int")))).getOrElse(BigDecimal(0))
      val recoveries = Try(BigDecimal(fields(splitColumns("recoveries")))).getOrElse(BigDecimal(0))
      val lastPaymentMonth = Try(if (fields(splitColumns("last_pymnt_d")) != "") fields(splitColumns("last_pymnt_d")) else fields(splitColumns("issue_d"))).getOrElse("")
      val lastPaymentAmount = Try(BigDecimal(fields(splitColumns("last_pymnt_amnt")))).getOrElse(BigDecimal(0))
      Loan(fundedAmount,
        issuedMonth,
        term,
        intRate,
        installment,
        grade,
        state,
        paidPrincipal,
        paidInterest,
        recoveries,
        lastPaymentMonth,
        lastPaymentAmount)
    })
  }
}
