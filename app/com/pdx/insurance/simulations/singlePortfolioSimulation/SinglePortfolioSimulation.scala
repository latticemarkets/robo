/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.pdx.insurance.simulations.singlePortfolioSimulation

import java.io.{File, PrintWriter}
import java.time.LocalDate

import com.pdx.insurance.simulations.SimulationUtils._
import com.pdx.insurance.simulations.{Loan, MonthlyResult}

import scala.io.Source
import scala.util.Random

/**
  * @author : julienderay
  * Created on 24/03/2016
  */

object SinglePortfolioSimulation {
  val Iterations = 10000
  val NoteSize = BigDecimal(25)

  def main(args: Array[String]): Unit = {
    val startingDate = LocalDate.of(2012, 1, 1)
    val simulateFor = 36 //months
    val balnace = BigDecimal(2000)
    val lines: Seq[String] = Source.fromFile(new File(InputFile)).getLines.toSeq
    val loans = linesToLoan(lines.drop(1).reverse, lines.head).toArray
    simulation("lowRiskPortfolio", Iterations, startingDate, simulateFor, balnace, NoteSize, LCAllAWeights, loans, LowInsuranceFactor)
    simulation("conservativePortfolio", Iterations, startingDate, simulateFor, balnace, NoteSize, LCConservativeWeights, loans, LowInsuranceFactor)
    simulation("moderatePortfolio", Iterations, startingDate, simulateFor, balnace, NoteSize, LCModerateWeights, loans, MedInsuranceFactor)
    simulation("aggressivePortfolio", Iterations, startingDate, simulateFor, balnace, NoteSize, LCAggressiveWeights, loans, HighInsuranceFactor)
  }

  // runs n iteration of the experiment and returns converged averaged results
  def simulation(name: String, iterations: Int, startingDate: LocalDate, duration: Int, balance: BigDecimal, noteSize: BigDecimal, weights: Seq[Double], loans: Array[Loan], insuranceFactor: Double) = {
    println(ExperimentResult.headings mkString ",")
    val results = (0 until iterations) map (i => experiment(loans, startingDate, duration, balance, noteSize, weights, insuranceFactor))
    writeToFile(name, results)
  }

  // select loans based on the given balance and weights that were issued on the given month
  def select(initialLoans: Seq[Loan], startingDate: String, balance: BigDecimal, weights: Seq[Double]): Array[Loan] = {
    val numLoans = balance / NoteSize
    val filtered = initialLoans.filter(loan => loan.issuedMonth.equalsIgnoreCase(startingDate) && loan.term == 36)
    val grades = filtered groupBy (_.grade)
    grades.flatMap { case (g, l) => Random.shuffle(Random.shuffle(Random.shuffle(l))).take((weights(IndexToGrade.indexOf(g)) * numLoans).setScale(0, BigDecimal.RoundingMode.HALF_UP).toIntExact) }.toArray
  }

  // runs an experiment on one portfolio given a starting date, duration, initial balance, note size, and required weights
  def experiment(loans: Array[Loan], startingDate: LocalDate, duration: Int, balance: BigDecimal, noteSize: BigDecimal, weights: Seq[Double], insuranceFactor: Double): ExperimentResult = {
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

object ExperimentResult {
  val headings: Seq[String] = Seq("irr without insurance", "irr with insurance", "total premia", "total repaid by insurance", "insurnace pnl", "irr decrease", "profit rate", "end balance")
}
case class ExperimentResult(startingDate: String, initialBalance: BigDecimal, byMonth: Seq[MonthlyResult]) {
  val irrWithoutInsurance: Double = irr(Accuracy, -initialBalance.doubleValue +: byMonth.map(_.totalMonthlyPaid.doubleValue))
  val irrWithInsurance: Double = irr(Accuracy, -initialBalance.doubleValue +: byMonth.map(_.cashFlow.doubleValue))
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