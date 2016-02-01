/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */

package com.pdx.originator.lendingclub

import play.api.libs.json.Json
import scalaj.http.Http
import play.api.Logger
import java.time.ZonedDateTime
import Formatters._
import LendingClubConfig._

/**
 * Implementation for lending club connection api
 *
 * TODO test all
 *
 * @author ze97286
 */

object LendingClubConnectionImpl extends LendingClubConnection {

  def main(args: Array[String]): Unit = {
    (0 until 10) foreach (x=> availableLoans)
  }
  
  /**
   * Submit an order to buy loans based on the given sequence of orders
   */
  override def submitOrder(orders: Seq[Order]): ExecutionReport = {
    Logger.info(s"submitting orders ${orders mkString "\n"}")
    val lcOrders = Orders(LendingClubConfig.Account, orders)
    val jsonOrders = Json.toJson(lcOrders).toString
    val erString = Http(SubmitOrderUrl).headers(
      ("Content-Type", "application/json"),
      (AuthorisationHeader, Authorisation),
      (ApiKeyHeader, ApiKey)).postData(jsonOrders).asString.body
    val erJson = Json.parse(erString)
    Json.fromJson[ExecutionReport](erJson).asOpt match {
      case None =>
        val err = s"failed to process submit order response: $erJson"
        Logger.error(err)
        throw new IllegalArgumentException(err)
      case Some(er) =>
        Logger.info(s"sucessfully processed execution report: ${er.orderInstructId} => \n${er.orderConfirmations mkString "\n"}")
        er
    }
  }

  /**
   * Get notes owned through lattice
   */
  override def ownedNotes: Seq[LendingClubNote] = {
    Logger.info("requesting owned notes from LendingClub")
    val notesString = Http(LendingClubConfig.OwnedNotesUrl)
      .headers((AuthorisationHeader, Authorisation),
        (ApiKeyHeader, ApiKey)).asString.body

    val notes = if (notesString == LendingClubConfig.EmptyDoc) {
      Seq()
    } else {
      val notesJson = Json.parse(notesString)
      Json.fromJson[OwnedNotes](notesJson).asOpt.get.myNotes
    }

    Logger.info(s"found notes:${notes mkString "\n"}")
    notes
  }

  /**
   * Get the currently available loans listing
   */
  override def availableLoans: LoanListing = {
    Logger.info("requesting available loans from LendingClub")
    val t0 = System.nanoTime
    val loansString = Http(LendingClubConfig.LoanListingUrl)
      .headers((AuthorisationHeader, Authorisation),
        (ApiKeyHeader, ApiKey)).asString.body
    val t1 = System.nanoTime
    val loansJson = Json.parse(loansString)
    val t2 = System.nanoTime
    val loans = Json.fromJson[LoanListing](loansJson).asOpt.getOrElse(LoanListing(ZonedDateTime.now, Seq()))
    val t3 = System.nanoTime
    val loansWithFilter=loans.loans filter (_.gradeEnum==Grade.E)
    val t4 = System.nanoTime
    println(s"time to get the loans: ${(t1 - t0) / 1000000d}")
    println(s"time to get to json: ${(t2 - t1) / 1000000d}")
    println(s"time to get to scala: ${(t3 - t2) / 1000000d}")
    println(s"time to filter: ${(t4 - t3) / 1000000d}")

    println(s"number of loans: ${loans.loans.size}")
    
//    Logger.info(s"found loans [${loans.asOfDate}:\n${loans.loans mkString "\n"}")
    loans
  }

  /**
   * Get lattice account summary from LC
   */
  override def accountSummary: AccountSummary = {
    Logger.info("requesting account summary (for lattice) from LendingClub")
    val summaryString = Http(LendingClubConfig.AccountSummaryUrl)
      .headers((AuthorisationHeader, Authorisation),
        (ApiKeyHeader, ApiKey)).asString.body

    val summaryJson = Json.parse(summaryString)

    val summary = Json.fromJson[AccountSummary](summaryJson).asOpt
    summary match {
      case Some(s) =>
        Logger.info(s"account summary: $s")
        s
      case _ => throw new IllegalArgumentException("Failed to get account summary for lattice from LendingClub")
    }
  }
}