/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.pdx.insurance.simulations.globalInsuranceSimulation

import java.time.LocalDate

import com.pdx.insurance.simulations.SimulationUtils._
import com.pdx.insurance.simulations._

import scala.collection.immutable.IndexedSeq

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

    val loans: Array[Loan] = parseLoans

    println(SimulationResult.headings mkString "")

    val res: Seq[SimulationResult] = (0 until iterations) map (_ => {
      val simulationResult = simulation(nbOfPortfolios, startingDate, simulateFor, portfolioSizeWeights, noteSizeWeights, strategyWeights, loans)
      println(simulationResult)
      simulationResult
    })
    writeToFile("simulation", res, SimulationResult.headings)
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