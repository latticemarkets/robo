/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.pdx.insurance.simulations.globalInsuranceSimulation

import java.io.{File, PrintWriter}
import java.time.LocalDate

import com.pdx.insurance.simulations.SimulationUtils._
import com.pdx.insurance.simulations._

import scala.collection.immutable.IndexedSeq
import scala.io.Source
import scala.util.Random

/**
 * @author : julienderay
 * Created on 09/03/2016
 */

object MultiPortfolioSimulation {
  val PortfolioSizes = Seq(1000, 5000, 15000, 25000, 30000, 100000)
  val NoteSizes = Seq(25, 50, 100, 300)
  val Strategies = Seq(Strategy(LCConservativeWeights, LowInsuranceFactor), Strategy(LCModerateWeights, MedInsuranceFactor), Strategy(LCAggressiveWeights, HighInsuranceFactor))

  def main(args: Array[String]): Unit = {
    val startingDate = LocalDate.of(2012, 1, 1)
    val simulateFor = 36 //months
    val portfolioSizeWeights = Seq(0.2d, 0.3d, 0.2d, 0.2d, 0.05d, 0.05d)
    val noteSizeWeights = Seq(0.2d, 0.4d, 0.2d, 0.2d)
    val strategyWeights = Seq(0.4d, 0.3d, 0.3d)
    val nbOfPortfolios = 10000
    val iterations = 1000
    val lines: Seq[String] = Source.fromFile(new File(LCInputFile)).getLines.toSeq
    val loans = linesToLoan(lines.drop(1).reverse, lines.head).toArray

    val res: Seq[SimulationResult] = (0 until iterations) map (_ => {
      val simulationResult = simulation(nbOfPortfolios, startingDate, simulateFor, portfolioSizeWeights, noteSizeWeights, strategyWeights, loans)
      printSimulationResult(simulationResult)
      simulationResult
    })
    writeToFile("simulation", res)
  }

  // runs an experiment on n portfolios given fixed starting date and duration, and variable initial balance, note size and required weights
  def simulation(nbOfPortfolios: Int, startingDate: LocalDate, duration: Int, portfolioSizeWeights: Seq[Double], noteSizeWeight: Seq[Double], strategyWeights: Seq[Double], loans: Array[Loan]): SimulationResult = {
    val initialBalances = weighted(portfolioSizeWeights, nbOfPortfolios, PortfolioSizes)
    val noteSizes = weighted(noteSizeWeight, nbOfPortfolios, NoteSizes)
    val strategies = weighted(strategyWeights, nbOfPortfolios, Strategies)

    val simulation = (0 until nbOfPortfolios) map (i => {
      val balance = initialBalances(i)
      val noteSize = noteSizes(i)
      val strategy = strategies(i)

      // make initial selection of loans for the portfolio
      val portfolio = select(loans, startingDate, balance, strategy.gradeWeights, noteSize)
      val er = ExperimentResult(startingDate, balance, simulateThePeriod(loans, startingDate, duration, balance, noteSize, strategy.gradeWeights, strategy.insuranceFactor, portfolio))
      er
    })

    SimulationResult(simulation)
  }

  // select loans based on the given balance and weights that were issued on the given month
  def select(initialLoans: Seq[Loan], startingDate: String, balance: BigDecimal, weights: Seq[Double], noteSize: BigDecimal): Array[Loan] = {
    val numLoans = balance / noteSize
    val filtered = initialLoans.filter(loan => loan.issuedMonth.equalsIgnoreCase(startingDate) && loan.term == 36)
    val grades = filtered groupBy (_.grade)
    grades.flatMap { case (g, l) => Random.shuffle(Random.shuffle(Random.shuffle(l))).take((weights(IndexToGrade.indexOf(g)) * numLoans).setScale(0, BigDecimal.RoundingMode.HALF_UP).toIntExact) }.toArray
  }

  def writeToFile(name: String, simulationResults: Seq[SimulationResult]) {
    val pw = new PrintWriter(s"$name.csv")
    pw.println(SimulationResult.headings mkString ",")
    simulationResults foreach ( res => pw.println(res.toString))
    pw.close()
  }

  def printSimulationResult(res: SimulationResult) {
    println(SimulationResult.headings mkString "")
    println(res.toString)
  }
}

object ExperimentResult {
  val headings: Seq[String] = Seq("insurnace pnl", "profit rate", "total repaid by insurance", "total premia")
}
case class ExperimentResult(startingDate: String, initialBalance: BigDecimal, byMonth: Seq[MonthlyResult]) {
  val totalInsurancePayments: BigDecimal = byMonth.map(_.totalInsuranceCost.doubleValue).sum
  val totalDefaultRepayments: BigDecimal = byMonth.map(_.totalDefaultRepayments).sum
  val insurancePnL = totalInsurancePayments - totalDefaultRepayments
  val profitRate = (insurancePnL / initialBalance)*100d

  override def toString: String = {
    s"$insurancePnL, $profitRate, $totalDefaultRepayments, $totalInsurancePayments"
  }
}

case class Strategy(gradeWeights: Seq[Double], insuranceFactor: Double)

case class SimulationResult(results: IndexedSeq[ExperimentResult]) {
  val totalPremiumPayments: BigDecimal = results.map(_.totalInsurancePayments).sum
  val totalDefaultPayments: BigDecimal = results.map(_.totalDefaultRepayments).sum
  val insurancePnL: BigDecimal = totalPremiumPayments - totalDefaultPayments
  val profitRate: BigDecimal = (insurancePnL / results.map(_.initialBalance).sum) * 100

  override def toString: String = s"$totalPremiumPayments, $totalDefaultPayments, $insurancePnL, $profitRate"
}
object SimulationResult {
  val headings: Seq[String] = Seq("total premium payments", "total default payments", "insurance PnL", "profit rate")
}