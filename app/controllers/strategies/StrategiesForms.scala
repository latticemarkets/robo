/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.strategies

import core.Forms
import models.{AutomatedStrategy, ManualStrategy}
import play.api.data.Form
import play.api.data.Forms._

/**
  * @author : julienderay
  * Created on 22/02/2016
  */

object StrategiesForms {
  def updateStrategiesForm = Form(
    mapping(
      "email" -> email,
      "platform" -> nonEmptyText,
      "strategies" -> set(Forms.manualStrategyMapping)
  )(UpdateStrategies.apply)(UpdateStrategies.unapply))

  def updateAutomatedStrategy = Form(
    mapping(
      "email" -> email,
      "platform" -> nonEmptyText,
      "autoStrategy" -> Forms.automatedStrategyMapping
    )(UpdateAutomatedStrategy.apply)(UpdateAutomatedStrategy.unapply)
  )
}

sealed class UpdatePlatform(
             val email: String,
             val platform: String
           )

case class UpdateStrategies(
           override val email: String,
           override val platform: String,
           strategies: Set[ManualStrategy]
             ) extends UpdatePlatform(email, platform)

case class UpdateAutomatedStrategy(
            override val email: String,
            override val platform: String,
            autoStrategy: AutomatedStrategy
            ) extends UpdatePlatform(email, platform)