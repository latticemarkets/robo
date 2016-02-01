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
trait LendingClubConnection {

  // submit an order to lending club
  def submitOrder(orders: Seq[Order]): ExecutionReport

  // get a sequence of owned loans details
  def ownedNotes: Seq[LendingClubNote]

  // get a sequence of available loans
  def availableLoans: LoanListing

  // get lattice account summary in LC
  def accountSummary: AccountSummary


}