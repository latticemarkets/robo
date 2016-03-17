/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.strategies

import javax.inject.Inject

import controllers.{Security, Utils}
import models._
import play.api.libs.json.Json
import play.api.mvc.{Controller, Result}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
/**
  * @author : julienderay
  * Created on 22/02/2016
  */

class Strategies @Inject() (dbUser: User, security: Security) extends Controller {
  implicit val inSetParamsFormat = Json.format[InSetParams]
  implicit val inRangeParamsIntFormat = Json.format[InRangeParams]
  implicit val expectedReturnFormat = Json.format[ExpectedReturn]
  implicit val ruleFormat = Json.format[Rule]
  implicit val manualStrategyFormat = Json.format[ManualStrategy]
  implicit val automatedStrategyFormat = Json.format[AutomatedStrategy]
  implicit val primaryMarketFormat = Json.format[PrimaryMarket]
  implicit val secondaryMarketFormat = Json.format[SecondaryMarket]
  implicit val platformFormat = Json.format[Platform]

  def updatePrimaryMarketBuyStrategies() = security.HasToken.async { implicit request =>
    StrategiesForms.updateStrategiesForm.bindFromRequest.fold(
      Utils.badRequestOnError[UpdateStrategies],
      data => updateStrategies[UpdateStrategies](
          data,
          request.headers.get("USER").getOrElse(""),
          (data, platform) => platform.copy(primary = platform.primary.copy(buyStrategies = data.strategies))
      )
    )
  }

  def updateSecondaryMarketBuyStrategies() = security.HasToken.async { implicit request =>
    StrategiesForms.updateStrategiesForm.bindFromRequest.fold(
      Utils.badRequestOnError[UpdateStrategies],
      data => updateStrategies[UpdateStrategies](
          data,
          request.headers.get("USER").getOrElse(""),
          (data, platform) => platform.copy(secondary = platform.secondary.copy(buyStrategies = data.strategies))
      )
    )
  }

  def updateSecondaryMarketSellStrategies() = security.HasToken.async { implicit request =>
    StrategiesForms.updateStrategiesForm.bindFromRequest.fold(
      Utils.badRequestOnError[UpdateStrategies],
      data => updateStrategies[UpdateStrategies](
          data,
          request.headers.get("USER").getOrElse(""),
          (data, platform) => platform.copy(secondary = platform.secondary.copy(sellStrategies = data.strategies))
      )
    )
  }

  def updateAutomatedStrategy() = security.HasToken.async { implicit request =>
    StrategiesForms.updateAutomatedStrategy.bindFromRequest.fold(
      Utils.badRequestOnError[UpdateAutomatedStrategy],
      data => updateStrategies[UpdateAutomatedStrategy](
        data,
        request.headers.get("USER").getOrElse(""),
        (data, platform) => platform.copy(automatedStrategy = data.autoStrategy)
      )
    )
  }

  def getAutomatedStrategy(originator: String) = security.HasToken.async { implicit request =>
    dbUser.findByEmail(request.headers.get("USER").getOrElse("")) map (_.map(user => {
      val autoStrategy = user.platforms
        .filter(p => p.originatorEnum == OriginatorEnum.withName(originator))
        .head
        .automatedStrategy
      Ok(Json.toJson(autoStrategy))
    }) getOrElse Utils.responseOnWrongDataSent)
  }

  def updateStrategies[T <: UpdatePlatform](data: T, email: String, platformUpdater: (T, Platform) => Platform): Future[Result] = {
    dbUser.findByEmail(email) flatMap (_.map(user => {
      user.platforms.find(_.originator == data.platform) map (platform => {
        val updatedPlatform = platformUpdater(data, platform)
        val platforms = user.platforms.map {
          case p if p.originator == data.platform => updatedPlatform
          case p => p
        }
        dbUser.update(user.copy(platforms = platforms)) map (user => Ok(""))
      }) getOrElse Future.successful(BadGateway(""))
    }) getOrElse Future.successful(BadGateway("")))
  }
}
