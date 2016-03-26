/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.pdx.insurance.simulations

import java.time.LocalDate

/**
  * @author : julienderay
  * Created on 24/03/2016
  */

case class MonthlyResult(date: LocalDate,
                         portfolio: Seq[Loan],
                         totalMonthlyPaid: BigDecimal,
                         totalDefaultRepayments: BigDecimal,
                         totalBalance: BigDecimal,
                         insuranceFactor: Double) {
  val totalInsuranceCost = insuranceFactor * totalMonthlyPaid
  val cashFlow = totalMonthlyPaid + totalDefaultRepayments - totalInsuranceCost
  val insuranceCashFlow = totalInsuranceCost - totalDefaultRepayments
}