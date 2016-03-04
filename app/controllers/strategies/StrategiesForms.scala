/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.strategies

import core.ModelForms
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
      "platform" -> nonEmptyText,
      "strategies" -> seq(ModelForms.manualStrategyMapping)
  )(UpdateStrategies.apply)(UpdateStrategies.unapply))

  def updateAutomatedStrategy = Form(
    mapping(
      "platform" -> nonEmptyText,
      "autoStrategy" -> ModelForms.automatedStrategyMapping
    )(UpdateAutomatedStrategy.apply)(UpdateAutomatedStrategy.unapply)
  )
}

sealed class UpdatePlatform(
             val platform: String
           )

case class UpdateStrategies(
           override val platform: String,
           strategies: Seq[ManualStrategy]
             ) extends UpdatePlatform(platform)

case class UpdateAutomatedStrategy(
            override val platform: String,
            autoStrategy: AutomatedStrategy
            ) extends UpdatePlatform(platform)