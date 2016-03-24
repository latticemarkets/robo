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
import java.time.LocalDate
import scala.util.Try
import java.io.PrintWriter

/**
 * @author : julienderay
 * Created on 09/03/2016
 */

object Simulations {
  val IndexToGrade = Seq("A", "B", "C", "D", "E", "F", "G")
  val DefaultStates = Set("Charged Off", "Default", "In Grace Period", "Late (16-30 days)", "Late (16-30 days)", "Late (31-120 days)")
//  val InputFile = "/Users/ze97286/Downloads/preprocessed.csv"
  val InputFile = "/Users/julienderay/Lattice/csvPreprocessor/main/preprocessedCSV.csv"
  val AllAWeights = Seq(1d, 0d, 0d, 0d, 0d, 0d, 0d)
  val ConservativeWeights = Seq(0.981d, 0.019d, 0d, 0d, 0d, 0d, 0d)
  val ModerateWeights = Seq(0.01d, 0.52d, 0.08d, 0.238d, 0.118d, 0.031d, 0d)
  val AggressiveWeights = Seq(0d, 0d, 0.17d, 0.507d, 0.251d, 0.066d, 0d)
  val NbOfPortfolios = 10000
  val NoteSize = BigDecimal(25)
  val Accuracy = 0.000001d
  val LossRate = 1d

  val LowInsuranceFactor = 0.05d
  val MedInsuranceFactor = 0.08d
  val HighInsuranceFactor = 0.12d

  // translate month to LC format
  implicit def localDateToLoanMonthFormat(ld: LocalDate): String = ld.getMonth.toString.take(3) + "-" + (ld.getYear.toString.drop(2))

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

  // select loans based on the given balance and weights that were issued on the given month
  def select(initialLoans: Seq[LCL], startingDate: String, balance: BigDecimal, weights: Seq[Double]): Array[LCL] = {
    val numLoans = balance / NoteSize
    val filtered = initialLoans.filter(loan => loan.issuedMonth.equalsIgnoreCase(startingDate) && loan.term == 36)
    val grades = filtered groupBy (_.grade)
    grades.flatMap { case (g, l) => Random.shuffle(Random.shuffle(Random.shuffle(l))).take((weights(IndexToGrade.indexOf(g)) * numLoans).setScale(0, BigDecimal.RoundingMode.HALF_UP).toIntExact) }.toArray
  }

  // select loans based on the required number, grade and month
  def select(loans: Seq[LCL], numLoans: Int, grade: String, month: String): Seq[LCL] = {
    val filtered = loans.filter(loan => (loan.issuedMonth.equalsIgnoreCase(month)) && loan.grade == grade)
    Random.shuffle(Random.shuffle(Random.shuffle(filtered))).take(numLoans)
  }

  def main(args: Array[String]): Unit = {
    val startingDate = LocalDate.of(2012, 1, 1)
    val simulateFor = 36 //months
    val balance = BigDecimal(2000)
    val lines: Seq[String] = Source.fromFile(new File(InputFile)).getLines.toSeq
    val loans = linesToLCL(lines.drop(1).reverse, lines.head).toArray
    simulation(NbOfPortfolios, startingDate, simulateFor, balance, NoteSize, AllAWeights, loans, LowInsuranceFactor)
  }

  // runs an experiment on n portfolios given fixed starting date and duration, and variable initial balance, note size and required weights
  def simulation(nbOfPortfolios: Int, startingDate: LocalDate, duration: Int, balance: BigDecimal, noteSize: BigDecimal, weights: Seq[Double], loans: Array[LCL], insuranceFactor: Double) = {
    // make initial selection of loans for the portfolio
    val portfolio = select(loans, startingDate, balance, weights)
    val er = ExperimentResult(startingDate, balance, simulateThePeriod(loans, startingDate, duration, balance, noteSize, weights, insuranceFactor, portfolio))
    printResult(er)
    er
  }

  def writeToFile(name: String, arr: Seq[ExperimentResult]) {
    val pw = new PrintWriter(s"${name}.csv")
    pw.println(ExperimentResult.headings mkString ",")
    arr foreach (x => pw.println(x.toString))
    pw.close()
  }

  def simulateThePeriod(loans: Array[LCL],
                        startingDate: LocalDate,
                        duration: Int,
                        initialBalance: BigDecimal,
                        noteSize: BigDecimal,
                        weights: Seq[Double],
                        insuranceFactor: Double,
                        portfolio: Seq[LCL]): Seq[MonthlyResult] = {

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

      //      // calculate how many new loans we can buy
      //      val newPortfolioSize = (balance / noteSize).toInt + continuingLoans.size
      //
      //      // calculate how many loans of each grade we need to buy
      //      val portfolioComposition = continuingLoans.groupBy(_.grade)
      //
      //      // calculate what should be the ratio of each grade in the new portfolio
      //      val needToBuy = weights.map(x => (x * newPortfolioSize).toInt).zipWithIndex.map { case (w, i) => IndexToGrade(i) -> (w - (portfolioComposition.get(IndexToGrade(i)).map(_.size).getOrElse(0))) }
      //      val newLoans = needToBuy.collect { case (k, v) if v > 0 => select(loans, v, k, currentMonth.plusMonths(1)) }.toSeq.flatten
      //      balance -= newLoans.size * NoteSize
      val mr = MonthlyResult(currentMonth, portfolioVar, incomeFromLoansEndedThisMonth + incomeFromLoansContinuing, lossFromDefaultsThisMonth, balance, insuranceFactor)
      portfolioVar = continuingLoans //++ newLoans
      mr
    })
  }

  def linesToLCL(loansStr: Seq[String], columns: String): Seq[LCL] = {
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
      LCL(fundedAmount,
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

  def printResult(res: ExperimentResult): Unit = {
    //    println(s"=============\nResults for portfolio - start date: ${res.startingDate} with USD${res.initialBalance}:\n")
    //    println(s"initial portfolio:")
    //    println(res.byMonth.head.portfolio mkString "\n")
    //
    //    res.byMonth foreach (m => {
    //      println(s"month: ${localDateToLoanMonthFormat(m.date)}")
    //      //      println("portfolio:")
    //      //      println(m.portfolio mkString "\n")
    //      println(s"total balance: ${m.totalBalance}")
    //      println(s"total repaid this month: ${m.totalMonthlyPaid}")
    //      println(s"loss to defaults this month: ${m.totalDefaultRepayments}")
    //    })
    //
    //    println(s"capital loss due to defaults: ${res.totalDefaultRepayments}")
    print(s"${res.irrWithoutInsurance}, ") //irr without insurance
    print(s"${res.irrWithInsurance}, ") //irr with insurance
    print(s"${res.totalInsurancePayments}, ") //total insurance payments
    print(s"${res.totalDefaultRepayments}, ") //total repaid by insurance
    print(s"${res.insurancePnL}, ") //insurnace pnl
    print(s"${res.totalDecreaseInIrrWithInsurance},") //total decrease in IRR due to insurance
    print(s"${res.profitRate * 100d},") // profit proportion of initial balance
    println(s"${res.endBalance}") // balance at the end of the period
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
    paidPrincipal: BigDecimal,
    paidInterest: BigDecimal,
    recoveries: BigDecimal,
    lastPaymentMonth: String,
    lastPaymentAmount: BigDecimal) {
  val totalPaid = paidPrincipal + paidInterest
}

case class MonthlyResult(date: LocalDate,
                         portfolio: Seq[LCL],
                         totalMonthlyPaid: BigDecimal,
                         totalDefaultRepayments: BigDecimal,
                         totalBalance: BigDecimal,
                         insuranceFactor: Double) {
  val totalInsuranceCost = insuranceFactor * totalMonthlyPaid
  val cashFlow = totalMonthlyPaid + totalDefaultRepayments - totalInsuranceCost
  val insuranceCashFlow = totalInsuranceCost - totalDefaultRepayments
}

object ExperimentResult {
  val headings: Seq[String] = Seq("irr without insurance", "irr with insurance", "total premia", "total repaid by insurance", "insurnace pnl", "irr decrease", "profit rate", "end balance")
}
case class ExperimentResult(startingDate: String, initialBalance: BigDecimal, byMonth: Seq[MonthlyResult]) {
  val irrWithoutInsurance: Double = Simulations.irr(Simulations.Accuracy, -initialBalance.doubleValue +: byMonth.map(_.totalMonthlyPaid.doubleValue))
  val irrWithInsurance: Double = Simulations.irr(Simulations.Accuracy, -initialBalance.doubleValue +: byMonth.map(_.cashFlow.doubleValue))
  val totalInsurancePayments: BigDecimal = byMonth.map(_.totalInsuranceCost.doubleValue).sum
  val totalDefaultRepayments: BigDecimal = byMonth.map(_.totalDefaultRepayments).sum
  val insurancePnL = totalInsurancePayments - totalDefaultRepayments
  val totalDecreaseInIrrWithInsurance = irrWithoutInsurance - irrWithInsurance
  val profitRate = (insurancePnL / initialBalance)*100d
  val endBalance = byMonth.map(_.cashFlow).sum

  override def toString: String = {
    s"$irrWithoutInsurance, $irrWithInsurance, $totalInsurancePayments, $totalDefaultRepayments, $insurancePnL, $totalDecreaseInIrrWithInsurance, $profitRate, $endBalance"
  }

}