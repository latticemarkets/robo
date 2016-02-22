/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.platforms

import core.Forms
import models.Platform
import play.api.data.Form
import play.api.data.Forms._

/**
  * @author : julienderay
  * Created on 22/02/2016
  */

object PlatformsForms {

  def addPlatformForm = Form(
    mapping(
      "email" -> email,
      "platform" -> platformMapping
    )(AddPlatform.apply)(AddPlatform.unapply)
  )

  def updatePlatforms = Form(
    mapping(
      "email" -> email,
      "platforms" -> seq(platformMapping)
    )(UpdatePlatforms.apply)(UpdatePlatforms.unapply)
  )

  def platformMapping = mapping(
    "originator" -> nonEmptyText,
    "accountId" -> nonEmptyText,
    "apiKey" -> nonEmptyText,
    "primary" -> Forms.primaryMarketMapping,
    "secondary" -> Forms.secondaryMarketMapping,
    "automatedStrategy" -> Forms.automatedStrategyMapping,
    "mode" -> nonEmptyText
  )(Platform.apply)(Platform.unapply)
}

case class UpdatePlatforms(email: String, platforms: Seq[Platform])

case class AddPlatform(email: String, platform: Platform)