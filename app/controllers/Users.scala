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
import models.{MarketType, Market, User}
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * @author : julienderay
  * Created on 27/01/2016
  */

class Users extends Controller {

  def respondWrongDataSent: Result = {
    BadRequest("Wrong data sent.")
  }

  def register = Action.async { implicit request =>
    Forms.registerForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful( respondWrongDataSent )
      },
      providedInfos => {
        User.store(providedInfos) map (optUser => optUser.map(user => Ok(Json.obj("token" -> user.token))).getOrElse(BadRequest("An error occurred when inserting data")))
      }
    )
  }

  def login = Action.async { implicit request =>
    Forms.loginForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful( respondWrongDataSent )
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
    User.findByEmail(email) map ( _.map (user => Ok(Json.toJson(user))) getOrElse respondWrongDataSent)
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
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-11-02", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-12-02", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-03-05", "intRate" -> 0.08),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-03-10", "intRate" -> 0.02),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-03-20", "intRate" -> 0.10),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-04-21", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-06-21", "intRate" -> 0.14),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-10-28", "intRate" -> 0.20),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-10-04", "intRate" -> 0.06),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-11-02", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-12-02", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-12-05", "intRate" -> 0.08),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-12-10", "intRate" -> 0.02),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2018-02-20", "intRate" -> 0.10),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2018-03-21", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2018-05-21", "intRate" -> 0.14),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2018-05-28", "intRate" -> 0.20),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2018-07-04", "intRate" -> 0.06),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-12-11", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-03-01", "intRate" -> 0.08),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-03-07", "intRate" -> 0.09),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-04-18", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-07-14", "intRate" -> 0.05),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-09-27", "intRate" -> 0.19),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-10-06", "intRate" -> 0.07),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-11-10", "intRate" -> 0.13),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-12-20", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-12-11", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-01-01", "intRate" -> 0.08),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-01-07", "intRate" -> 0.09),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-03-18", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-05-14", "intRate" -> 0.05),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-05-27", "intRate" -> 0.19),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-07-06", "intRate" -> 0.07),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-10-10", "intRate" -> 0.13),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-11-20", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-11-11", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-12-01", "intRate" -> 0.08),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-12-07", "intRate" -> 0.09),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-01-18", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-04-14", "intRate" -> 0.05),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-05-27", "intRate" -> 0.19),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-06-06", "intRate" -> 0.07),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-11-10", "intRate" -> 0.13),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-12-20", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-12-23", "intRate" -> 0.0)
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

  def portfolioSuggestion() = Action {
    Ok(Json.obj("portfolio" -> "moderate"))
  }

  def updatePassword() = HasToken.async { implicit request =>
    Forms.updatePasswordForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful( respondWrongDataSent )
      },
      infos => {
        User.findByEmail(infos.email) flatMap (optUser => optUser map (user =>
          if (Hash.checkPassword(infos.oldPassword, user.password)) {
            User.update(user.copy(password = Hash.createPassword(infos.newPassword)))
              .map (user => Ok(""))
          }
          else {
            Future.successful( BadRequest("Old password incorrect") )
          }
          ) getOrElse Future.successful( BadRequest("Wrong email") )
          )
      }
    )
  }

  def riskDiversification() = HasToken {
    Ok(Json.arr(
      Json.obj("grade" -> "A", "value" -> 240),
      Json.obj("grade" -> "B", "value" -> 49),
      Json.obj("grade" -> "C", "value" -> 189),
      Json.obj("grade" -> "D", "value" -> 140),
      Json.obj("grade" -> "E", "value" -> 200)
    ))
  }

  def updatePlatforms() = HasToken.async { implicit request =>
    Forms.updatePlatforms.bindFromRequest.fold(
      formWithErrors => Future.successful( respondWrongDataSent ),
      data => {
        User.findByEmail(data.email) flatMap (_.map (user => {
          User.update(user.copy(platforms = data.platforms)) map (user => Ok(""))
        }) getOrElse Future.successful( respondWrongDataSent ))
      }
    )
  }

  def addPlatform() = HasToken.async { implicit request =>
    Forms.addPlatformForm.bindFromRequest.fold(
      formWithErrors => Future.successful( respondWrongDataSent ),
      data => {
        User.findByEmail(data.email) flatMap (_.map (user => {
          User.update(user.copy(platforms = user.platforms :+ data.platform)) map (user => Ok(""))
        }) getOrElse Future.successful( respondWrongDataSent ))
      }
    )
  }

  def updatePersonalData() = HasToken.async { implicit request =>
    Forms.updatePersonalData.bindFromRequest.fold(
      formWithErrors => Future.successful( respondWrongDataSent ),
      data => {
        User.findByEmail(data.email) flatMap (_.map (user => {
          User.update(user.copy(firstName = data.firstName, lastName = data.lastName, birthday = data.birthday)) map (user => Ok(""))
        }) getOrElse Future.successful( respondWrongDataSent ))
      }
    )
  }

  def destroyAccount() = HasToken.async { implicit request =>
    Forms.destroyAccountForm.bindFromRequest.fold(
      _ => Future.successful( respondWrongDataSent ),
      data => {
        User.findByEmail(data.email) flatMap (optUser => optUser map (user =>
          if (Hash.checkPassword(data.password, user.password)) {
            User.delete(data.email) map (deleted => if (deleted) Ok("") else BadGateway(""))
          }
          else {
            Future.successful( BadRequest("Incorrect password") )
          }
          ) getOrElse Future.successful( BadGateway("") )
          )
      }
    )
  }

  def updateRules() = HasToken.async { implicit request =>
    Forms.updateRules.bindFromRequest.fold(
      formWithErrors => Future.successful( respondWrongDataSent ),
      data => {
        User.findByEmail(data.email) flatMap (_.map (user => {
          user.platforms.find(_.name == data.platform) map (platform => {
            val updatedPlatform =
              if (data.market == MarketType.primary.toString) platform.copy(primary = platform.primary.copy(rules = data.rules))
              else platform.copy(secondary = platform.secondary.copy(rules = data.rules))
            val platforms = user.platforms.map {
              case p if p.name == data.platform => updatedPlatform
              case p => p
            }
            User.update(user.copy(platforms = platforms)) map (user => Ok(""))
          }) getOrElse Future.successful( BadGateway("") )
        }) getOrElse Future.successful( BadGateway("") ))
      }
    )
  }

  def updateAutoStrategy() = play.mvc.Results.TODO
}
