/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package core

import models._
import play.api.libs.json.{Format, Json}

/**
  * @author : julienderay
  * Created on 24/02/2016
  */

object Formatters {
  implicit val inSetParamsFormat = Json.format[InSetParams]
  implicit val inRangeParamsIntFormat = Json.format[InRangeParams]
  implicit val expectedReturnFormat = Json.format[ExpectedReturn]
  implicit val ruleFormat = Json.format[Rule]
  implicit val manualStrategyFormat = Json.format[ManualStrategy]
  implicit val automatedStrategyFormat = Json.format[AutomatedStrategy]
  implicit val primaryMarketFormat = Json.format[PrimaryMarket]
  implicit val secondaryMarketFormat = Json.format[SecondaryMarket]
  implicit val platformFormat = Json.format[Platform]
  implicit val userFormat = Json.format[UserModel]

  implicit val portfolioCompositionFormat = Json.format[PortfolioComposition]
  implicit val strategyReturnsFormat = Json.format[StrategyReturns]
  implicit val simulationStepFormat = Json.format[SimulationStep]
  implicit val automatedStrategySimulationFormat = Json.format[AutomatedStrategySimulationModel]
}
