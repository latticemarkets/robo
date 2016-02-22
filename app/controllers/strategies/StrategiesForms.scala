/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.strategies

import core.Forms
import models.ManualStrategy
import play.api.data.Form
import play.api.data.Forms._

/**
  * @author : julienderay
  * Created on 22/02/2016
  */

object StrategiesForms {
  def updatePrimaryMarketBuyStrategiesForm = Form(
    mapping(
      "email" -> email,
      "platform" -> nonEmptyText,
      "strategies" -> set(Forms.manualStrategyMapping)
  )(UpdatePrimaryMarketBuyStrategies.apply)(UpdatePrimaryMarketBuyStrategies.unapply))
}

case class UpdatePrimaryMarketBuyStrategies(
             email: String,
             platform: String,
             strategies: Set[ManualStrategy]
             )