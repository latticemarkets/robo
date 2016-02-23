/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.users

import java.util.Date

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
      "email" -> email,
      "oldPassword" -> nonEmptyText,
      "newPassword" -> nonEmptyText
    )(UpdatePassword.apply)(UpdatePassword.unapply)
  )

  def updatePersonalData = Form(
    mapping(
      "email" -> email,
      "firstName" -> nonEmptyText,
      "lastName" -> nonEmptyText,
      "birthday" -> date("MM/dd/yyyy")
    )(UpdatePersonalData.apply)(UpdatePersonalData.unapply)
  )

  def destroyAccountForm = Form(
    mapping(
      "email" -> email,
      "password" -> nonEmptyText
    )(DestroyAccount.apply)(DestroyAccount.unapply)
  )

  def registerForm = Form(
    mapping (
      "email" -> email,
      "password" -> nonEmptyText,
      "terms" -> nonEmptyText,
      "reason" -> nonEmptyText,
      "income" -> nonEmptyText,
      "timeline" -> nonEmptyText,
      "birthday" -> date("MM/dd/yyyy"),
      "firstName" -> nonEmptyText,
      "lastName" -> nonEmptyText,
      "originator" -> nonEmptyText,
      "accountId" -> nonEmptyText,
      "apiKey" -> nonEmptyText
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
       originator: String,
       accountId: String,
       apiKey: String)