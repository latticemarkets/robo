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

  val indexToGrade = Map(0 -> "A", 1 -> "B", 2 -> "C", 3 -> "D", 4 -> "E", 5 -> "F", 6 -> "G")
  val inputFile =  "/Users/julienderay/Lattice/csvPreprocessor/main/preprocessedCSV.csv"
  val nbInstances = 1000

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

  def experiment(nbInstances: Int, inputFile: String): Unit = {
      val loans = linesToLCL(Source.fromFile(new File(inputFile)).getLines.toSeq.drop(1))
      println(loans.size)
  }

  def main(args: Array[String]): Unit = {
    experiment(nbInstances, inputFile)
  }
}