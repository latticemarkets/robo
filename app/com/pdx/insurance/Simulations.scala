/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.pdx.insurance

import java.io.File
import java.util.UUID

import scala.io.Source

/**
  * @author : julienderay
  * Created on 09/03/2016
  */
object Simulations {

  val indexToGrade = Seq("A", "B", "C", "D", "E", "F", "G")
  val defaultStates = Set("Charged Off", "Default", "In Grace Period", "Late (16-30 days)", "Late (16-30 days)", "Late (31-120 days)")

  def linesToLCL(loansStr: Seq[String]): Seq[LCL] = {
    loansStr
      .filter(l => {
        val outstandingPrincipal = try { BigDecimal(l.split(",")(59)) > -1 } catch { case _: Throwable => false }

        l.split(",").size == 78 && outstandingPrincipal
      })
      .map (line => {
        val fields = line.split(",")

        LCL(
          id = UUID.randomUUID().toString,
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
          lastPayment = fields(66))
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
    val filtered = initialLoans.filter(loan => {
      loan.term == term && dateAfter(startingDate, loan.issuedMonth)
    })
    val grades = filtered groupBy (_.grade) map { case (g, l) => g -> util.Random.shuffle(util.Random.shuffle(util.Random.shuffle(l))) }
    grades.flatMap { case (g, l) => l.take((weights(indexToGrade.indexOf(g)) * portfolioSize.toDouble).toInt) }.toArray
  }

  def experiment(nbInstances: Int, inputFile: String, weights: Seq[Double], term: Int, startingDate: String, portfolioSize: Int, noteSize: BigDecimal): Unit = {
    val iteratedDatesStr = (0 until term) map (month => {
      val parsedStartingDate: MonthDate = MonthDate(startingDate)

      val monthNb: Int = (parsedStartingDate.month - 1 + month) % 12
      val monthStr = MonthDate.monthsList(monthNb)

      val year = ((parsedStartingDate.month - 1 + month) / 12) + parsedStartingDate.year

      s"$monthStr-${if (year.toString.length > 1) year else s"0$year"}"
    })

    val initialLoans = linesToLCL(Source.fromFile(new File(inputFile)).getLines.toSeq.drop(1))
    val firstLoansInPortfolio = select(initialLoans, weights, term, startingDate, portfolioSize)

    val portfolioActualWeights = Seq(0, 0, 0 ,0, 0, 0, 0)
    var portfolioBalance: BigDecimal = 0
    val defaultationCalendar = firstLoansInPortfolio
      .filter(l => defaultStates.contains(l.state))
      .groupBy(_.lastPayment)
      .map{ case (dateStr, loan) => dateStr -> loan }

    (0 until term) foreach (month => {
      firstLoansInPortfolio.foreach(l => {
        val interests = (l.fundedAmount * l.intRate / 36) * noteSize / l.fundedAmount
        portfolioBalance = portfolioBalance + interests
      })
    })

    println(portfolioBalance)
  }

  def main(args: Array[String]): Unit = {
    val inputFile =  "/Users/julienderay/Lattice/csvPreprocessor/main/preprocessedCSV.csv"

    val nbInstances = 1000
    val weights = Seq(1d, 0d, 0d, 0d, 0d, 0d, 0d)
    val term = 36
    val startingDate = "Jun-07"
    val portfolioSize = 1000
    val noteSize = 25

    experiment(nbInstances, inputFile, weights, term, startingDate, portfolioSize, noteSize)
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
                id: String,
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
                lastPayment: String)