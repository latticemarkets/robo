/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.pdx.insurance

import java.io.File

import com.pdx.insurance.Analyser.LCL

import scala.io.Source

/**
  * @author : julienderay
  * Created on 09/03/2016
  */
object Simulations {

  val indexToGrade = Map(0 -> "A", 1 -> "B", 2 -> "C", 3 -> "D", 4 -> "E", 5 -> "F", 6 -> "G") // todo : change to seq ...

  val inputFile =  "/Users/julienderay/Lattice/csvPreprocessor/main/preprocessedCSV.csv"

  val nbInstances = 1000
  val weights = Weights(gradeA = 1d, gradeB = 0d, gradeC = 0d, gradeD = 0d, gradeE = 0d, gradeF = 0d, gradeG = 0d)
  val term = 36
  val startingDate = "Nov-14"

  def linesToLCL(loansStr: Seq[String]): Seq[LCL] = {
    loansStr
      .filter(f => f.split(",").size == 78)
      .map (line => {
        val fields = line.split(",")

        LCL(fundedAmount = BigDecimal(fields(0)),
          term = Integer.parseInt(fields(1).trim.split(" ").head),
          intRate = fields(2).dropRight(1).toDouble,
          installment = BigDecimal(fields(3)),
          grade = indexToGrade.find { case (index, grade) => fields(index + 4) == "1" }.get._2,
          issuedMonth = fields(22),
          state = fields(23),
          outstandingPrincipal = BigDecimal(fields(59)),
          totalPaid = BigDecimal(fields(60)),
          paidPrincipal = BigDecimal(fields(61)),
          paidInterest = BigDecimal(fields(62)),
          lateFees = BigDecimal(fields(63)),
          recoveries = BigDecimal(fields(64)),
          recoveryFees = BigDecimal(fields(65)))
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

  def select(initialLoans: Seq[LCL], weights: Weights, term: Int, startingDate: String): Seq[LCL] = initialLoans.filter(loan => {
    loan.term == term && dateAfter(startingDate, loan.issuedMonth)
  })

  def experiment(nbInstances: Int, inputFile: String): Unit = {
    val initialLoans = linesToLCL(Source.fromFile(new File(inputFile)).getLines.toSeq.drop(1))
    val loansMeetingCriteria = select(initialLoans, weights, term, startingDate)
    println(initialLoans.size)
    println(loansMeetingCriteria.size)
  }

  def main(args: Array[String]): Unit = {
    experiment(nbInstances, inputFile)
  }
}

case class Weights(gradeA: Double, gradeB: Double, gradeC: Double, gradeD: Double, gradeE: Double, gradeF: Double, gradeG: Double)

case class MonthDate(month: Int, year: Int)
object MonthDate {
  val monthsList = Seq("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")

  def apply(str: String): MonthDate = {
    val split = str.split("-")
    MonthDate(monthsList.indexOf(split(0)) + 1, split(1).toInt)
  }
}