/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.platforms

import core.ModelForms
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
      "platform" -> newPlatformForm
    )(AddPlatform.apply)(AddPlatform.unapply)
  )

  def newPlatformForm =
    mapping(
      "originator" -> nonEmptyText,
      "accountId" -> nonEmptyText,
      "apiKey" -> nonEmptyText
    )(NewPlatform.apply)(NewPlatform.unapply)

  def updatePlatformsForm = Form(
    mapping(
      "email" -> email,
      "platforms" -> seq(ModelForms.platformMapping)
    )(UpdatePlatforms.apply)(UpdatePlatforms.unapply)
  )
}

case class UpdatePlatforms(email: String, platforms: Seq[Platform])

case class AddPlatform(email: String, platform: NewPlatform)

case class NewPlatform(originator: String, accountId: String, apiKey: String)