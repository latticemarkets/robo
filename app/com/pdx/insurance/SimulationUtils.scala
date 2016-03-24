/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.pdx.insurance

import java.time.LocalDate

/**
  * @author : julienderay
  *         Created on 24/03/2016
  */
object SimulationUtils {
  val LCAllAWeights = Seq(1d, 0d, 0d, 0d, 0d, 0d, 0d)
  val LCConservativeWeights = Seq(0.981d, 0.019d, 0d, 0d, 0d, 0d, 0d)
  val LCModerateWeights = Seq(0.01d, 0.52d, 0.08d, 0.238d, 0.118d, 0.031d, 0d)
  val LCAggressiveWeights = Seq(0d, 0d, 0.17d, 0.507d, 0.251d, 0.066d, 0d)

  // translate month to LC format
  implicit def localDateToLoanMonthFormat(ld: LocalDate): String = ld.getMonth.toString.take(3) + "-" + ld.getYear.toString.drop(2)

  def calculateIrrFor(guess: Double, values: Seq[Double]): Double = {
    var fValue = 0.0
    var fDerivative = 0.0
    for (i <- values.indices) {
      fValue += values(i) / Math.pow(1.0 + guess, i)
      fDerivative += -i * values(i) / Math.pow(1.0 + guess, i + 1)
    }
    fValue / fDerivative
  }
}
