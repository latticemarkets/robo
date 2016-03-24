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
