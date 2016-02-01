/**
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.pdx.originator.lendingclub

/**
 * @author ze97286
 */
case class AccountSummary(
  investorId: Int,
  availableCash: BigDecimal,
  accountTotal: BigDecimal,
  accruedInterest: BigDecimal,
  infundingBalance: BigDecimal,
  receivedInterest: BigDecimal,
  receivedPrincipal: BigDecimal,
  receivedLateFees: BigDecimal,
  outstandingPrincipal: BigDecimal,
  totalNotes: Int,
  totalPortfolios: Int)