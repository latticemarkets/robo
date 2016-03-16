/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package core

import controllers.Constraints
import models._
import play.api.data.Forms._

/**
  * @author : julienderay
  * Created on 27/01/2016
  */

object ModelForms {
  def primaryMarketMapping = mapping(
    "buyStrategies" -> seq(manualStrategyMapping)
  )(PrimaryMarket.apply)(PrimaryMarket.unapply)

  def secondaryMarketMapping = mapping(
    "buyStrategies" -> seq(manualStrategyMapping),
    "sellStrategies" -> seq(manualStrategyMapping)
  )(SecondaryMarket.apply)(SecondaryMarket.unapply)

  def manualStrategyMapping = mapping(
    "id" -> nonEmptyText,
    "name" -> nonEmptyText,
    "originator" -> nonEmptyText.verifying(Constraints.originatorCheck),
    "expectedReturn" -> expectedReturnMapping,
    "loansAvailablePerWeek" -> bigDecimal,
    "moneyAvailablePerWeek" -> bigDecimal,
    "rules" -> seq(ruleMapping),
    "isEnabled" -> boolean,
    "minNoteAmount" -> bigDecimal,
    "maxNoteAmount" -> bigDecimal
  )(ManualStrategy.apply)(ManualStrategy.unapply)

  def automatedStrategyMapping = mapping(
    "aggressivity" -> bigDecimal,
    "primaryMarketEnabled" -> boolean,
    "secondaryMarketEnabled" -> boolean
  )(AutomatedStrategy.apply)(AutomatedStrategy.unapply)

  def platformMapping = mapping(
    "originator" -> nonEmptyText.verifying(Constraints.originatorCheck),
    "accountId" -> nonEmptyText,
    "apiKey" -> nonEmptyText,
    "primary" -> ModelForms.primaryMarketMapping,
    "secondary" -> ModelForms.secondaryMarketMapping,
    "automatedStrategy" -> ModelForms.automatedStrategyMapping,
    "mode" -> nonEmptyText,
    "maximumDailyInvestment" -> bigDecimal
  )(Platform.apply)(Platform.unapply)

  def expectedReturnMapping = mapping(
     "value" -> bigDecimal,
     "percent" -> bigDecimal,
     "margin" -> bigDecimal
  )(ExpectedReturn.apply)(ExpectedReturn.unapply)

  def ruleMapping = mapping(
    "attribute" -> nonEmptyText,
    "ruleType" -> nonEmptyText, // InSet, InRange
    "ruleParams" -> nonEmptyText // format: for InSet: coma separated values, for InRange: lower bound, upperbound 
  )(Rule.apply)(Rule.unapply)
}
