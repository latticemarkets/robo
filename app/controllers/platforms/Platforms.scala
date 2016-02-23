/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.platforms

import controllers.Security.HasToken
import controllers.Utils
import controllers.users.UsersForms
import models._
import play.api.libs.json.Json
import play.api.mvc.Controller

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * @author : julienderay
  * Created on 22/02/2016
  */

class Platforms extends Controller {
  implicit val inSetParamsFormat = Json.format[InSetParams]
  implicit val inRangeParamsIntFormat = Json.format[InRangeParams]
  implicit val expectedReturnFormat = Json.format[ExpectedReturn]
  implicit val ruleFormat = Json.format[Rule]
  implicit val manualStrategyFormat = Json.format[ManualStrategy]
  implicit val automatedStrategyFormat = Json.format[AutomatedStrategy]
  implicit val primaryMarketFormat = Json.format[PrimaryMarket]
  implicit val secondaryMarketFormat = Json.format[SecondaryMarket]
  implicit val platformFormat = Json.format[Platform]
  implicit val userFormat = Json.format[User]

  def updatePlatforms() = HasToken.async { implicit request =>
    PlatformsForms.updatePlatformsForm.bindFromRequest.fold(
      Utils.badRequestOnError[UpdatePlatforms],
      data => {
        User.findByEmail(data.email) flatMap (_.map (user => {
          User.update(user.copy(platforms = data.platforms)) map (user => Ok(""))
        }) getOrElse Future.successful( Utils.responseOnWrongDataSent ))
      }
    )
  }

  def addPlatform() = HasToken.async { implicit request =>
    PlatformsForms.addPlatformForm.bindFromRequest.fold(
      Utils.badRequestOnError[AddPlatform],
      data => {
        User.findByEmail(data.email) flatMap (_.map (user => {
          val newPlatform = Platform.factory(data.originator, data.accountId, data.apiKey)
          User.update(user.copy(platforms = user.platforms :+ newPlatform)) map (user => Ok(""))
        }) getOrElse Future.successful( Utils.responseOnWrongDataSent ))
      }
    )
  }

  def getPlatforms() = HasToken.async { implicit request =>
    UsersForms.emailForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      data => {
        User.findByEmail(data.email) map ( _.map (user => Ok(Json.toJson(user.platforms))) getOrElse Utils.responseOnWrongDataSent)
      }
    )
  }
}
