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
case class Note(
    portfolioName:String, 
    noteId:String, 
    orderId:String,
    loanAmount:BigDecimal, 
    noteAmount:BigDecimal, 
    grade:Grade.Value, 
    interestRate: Double, 
    term:Term.Value, 
    loanStatus:String,
    paymentsReceived: BigDecimal,
    issueDate: Option[ZonedDateTime],
    orderDate: ZonedDateTime,
    purpose:String)