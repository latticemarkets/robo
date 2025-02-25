/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.users

import java.util.Date

import controllers.Constraints
import controllers.platforms.{NewPlatform, PlatformsForms}
import models._
import play.api.data.Form
import play.api.data.Forms._

/**
  * @author : julienderay
  * Created on 22/02/2016
  */

object UsersForms {
  def loginForm = Form(
    mapping(
      "email" -> email,
      "password" -> nonEmptyText
    )(Login.apply)(Login.unapply)
  )

  def updatePasswordForm = Form(
    mapping(
      "oldPassword" -> nonEmptyText,
      "newPassword" -> nonEmptyText.verifying(Constraints.strongPassword)
    )(UpdatePassword.apply)(UpdatePassword.unapply)
  )

  def sendEmailForm = Form(
    mapping(
      "email" -> nonEmptyText
    )(SendEmail.apply)(SendEmail.unapply)
  )

  def reinitializePasswordForm = Form(
    mapping(
      "tokenForgotPassword" -> nonEmptyText,
      "newPassword" -> nonEmptyText.verifying(Constraints.strongPassword)
    )(ReinitializePassword.apply)(ReinitializePassword.unapply)
  )

  def updatePersonalData = Form(
    mapping(
      "firstName" -> nonEmptyText,
      "lastName" -> nonEmptyText,
      "birthday" -> date("MM/dd/yyyy")
    )(UpdatePersonalData.apply)(UpdatePersonalData.unapply)
  )

  def destroyAccountForm = Form(
    mapping(
      "password" -> nonEmptyText
    )(DestroyAccount.apply)(DestroyAccount.unapply)
  )

  def registerForm = Form(
    mapping (
      "email" -> email,
      "password" -> nonEmptyText.verifying(Constraints.strongPassword),
      "terms" -> nonEmptyText.verifying(Constraints.isTrue),
      "reason" -> nonEmptyText.verifying(Constraints.isPartOf("reason", ReasonEnum)),
      "income" -> nonEmptyText.verifying(Constraints.isPartOf("income", YearlyIncomeEnum)),
      "timeline" -> nonEmptyText.verifying(Constraints.isPartOf("timeline", TimelineEnum)),
      "birthday" -> date("MM/dd/yyyy"),
      "firstName" -> nonEmptyText,
      "lastName" -> nonEmptyText,
      "platforms" -> seq(PlatformsForms.newPlatformForm)
    )(RegisterForm.apply)(RegisterForm.unapply)
  )
}

case class RegisterForm(
       email: String,
       password: String,
       terms: String,
       reason: String,
       income: String,
       timeline: String,
       birthday: Date,
       firstName: String,
       lastName: String,
       platforms: Seq[NewPlatform])
