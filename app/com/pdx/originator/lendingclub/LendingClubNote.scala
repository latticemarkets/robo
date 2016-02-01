/**
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */
package com.pdx.originator.lendingclub

import java.time.ZonedDateTime

/**
 * @author ze97286
 */

case class LendingClubNote(
    loanId: Int,
    noteId: Int,
    orderId: Int,
    portfolioName: Option[String],
    interestRate: Double,
    loanLength: Int,
    loanStatus: String,
    grade: String,
    loanAmount: BigDecimal,
    noteAmount: BigDecimal,
    currentPaymentStatus: Option[String],
    paymentsReceived: BigDecimal,
    accruedInterest: BigDecimal,
    principalPending: BigDecimal,
    interestPending: BigDecimal,
    principalReceived: BigDecimal,
    interestReceived: BigDecimal,
    nextPaymentDate: Option[ZonedDateTime],
    issueDate: Option[ZonedDateTime],
    orderDate: ZonedDateTime,
    purpose: String,
    loanStatusDate: ZonedDateTime) {

  val gradeEnum = Grade.withName("" + grade.head)

  val loanStatusEnum = LoanStatus.withName(loanStatus)
  
  val loanLengthEnum = loanLength match {
    case 24 => Term._24
    case 36 => Term._36
    case 60 => Term._60
    case _  => throw new IllegalArgumentException("unsupported term")
  }
}

object LendingClubNote {
  implicit class ToNote(lcn: LendingClubNote) {
    def toNote: Note = Note(
      lcn.portfolioName.getOrElse(""),
      lcn.noteId.toString,
      lcn.orderId.toString,
      lcn.loanAmount,
      lcn.noteAmount,
      lcn.gradeEnum,
      lcn.interestRate,
      lcn.loanLengthEnum,
      lcn.loanStatus,
      lcn.paymentsReceived,
      lcn.issueDate,
      lcn.orderDate,
      lcn.purpose)
  }
}
