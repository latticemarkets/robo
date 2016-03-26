/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.pdx.insurance.simulations

/**
  * @author : julienderay
  * Created on 24/03/2016
  */

case class Loan(
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
