/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers

import java.time.LocalDate

import controllers.Security.HasToken
import core.{Forms, Hash}
import models.User
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * @author : julienderay
  * Created on 27/01/2016
  */

class Users extends Controller {

  def register = Action.async { implicit request =>
    Forms.registerForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful( BadRequest("Wrong data sent.") )
      },
      providedInfos => {
        User.store(providedInfos) map (optUser => optUser.map(user => Ok(Json.obj("token" -> user.token))).getOrElse(BadRequest("An error occurred when inserting data")))
      }
    )
  }

  def login = Action.async { implicit request =>
    Forms.loginForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful( BadRequest("Wrong data sent.") )
      },
      login => {
        User.findByEmail(login.email) flatMap (optUser => optUser map (user =>
          if (Hash.checkPassword(login.password, user.password)) {
            User.generateAndStoreNewToken(user) map (user => Ok(Json.obj("token" -> user.token)))
          }
          else {
            Future.successful( BadRequest("Wrong password") )
          }
        ) getOrElse Future.successful( BadRequest("Wrong email") )
        )
      }
    )
  }

  def isUsed(email: String) = Action.async {
    User.findByEmail(email) map {
      case None => Ok(Json.obj("ok" -> true))
      case Some(user) => Ok(Json.obj("ok" -> false))
    }
  }

  def availableCapital() = HasToken {
    Ok(Json.obj("availableCapital" -> 200000))
  }

  def allocatedCapital() = HasToken {
    Ok(Json.obj("allocatedCapital" -> 300000))
  }

  def averageMaturity() = HasToken {
    Ok(Json.obj("averageMaturity" -> LocalDate.parse("2016-05-11")))
  }

  def averageIntRate() = HasToken {
    Ok(Json.obj("averageIntRate" -> 0.12))
  }

  def expectedReturns() = HasToken {
    Ok(Json.obj("expectedReturns" -> 34000))
  }

  def lastLoanMaturity() = HasToken {
    Ok(Json.obj("lastLoanMaturity" -> LocalDate.parse("2018-01-07")))
  }

  def currentRoiRate() = HasToken {
    Ok(Json.obj("currentRoiRate" -> 0.15))
  }

  def expectedRoiRate() = HasToken {
    Ok(Json.obj("expectedRoiRate" -> 0.12))
  }

  def userData(email: String) = HasToken.async {
    User.findByEmail(email) map (user => Ok(Json.toJson(user)))
  }

  def currentLoans() = HasToken {
    val loans = Json.arr(
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-02-02", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-02-02", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-03-05", "intRate" -> 0.08),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-02-10", "intRate" -> 0.02),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-04-20", "intRate" -> 0.10),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-06-21", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-06-21", "intRate" -> 0.14),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-07-28", "intRate" -> 0.20),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-09-04", "intRate" -> 0.06),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-12-11", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-03-01", "intRate" -> 0.08),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-03-07", "intRate" -> 0.09),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-04-18", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-07-14", "intRate" -> 0.05),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-09-27", "intRate" -> 0.19),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-10-06", "intRate" -> 0.07),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-11-10", "intRate" -> 0.13),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-12-20", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-12-23", "intRate" -> 0.0)
    )

    Ok(loans)
  }

  def loansAcquiredPerDayLastWeek() = HasToken {
    val loans = Json.arr(10, 26, 16, 36, 32, 51, 51)
    Ok(loans)
  }

  def platformAllocation() = HasToken {
    Ok(Json.arr(
      Json.obj("originator" -> "lendingClub", "loansAcquired" -> 245),
      Json.obj("originator" -> "prosper", "loansAcquired" -> 18),
      Json.obj("originator" -> "bondora", "loansAcquired" -> 59),
      Json.obj("originator" -> "ratesetter", "loansAcquired" -> 195),
      Json.obj("originator" -> "fundingCircle", "loansAcquired" -> 90)
    ))
  }
}
