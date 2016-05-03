/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.users

import javax.inject.Inject

import controllers.Security.HasToken
import controllers.Utils
import core.Formatters._
import core.{EmailUtil, Hash}
import models.{User, UserSecurity}
import play.api.libs.json.Json
import play.api.mvc._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * @author : julienderay
  * Created on 27/01/2016
  */

class Users @Inject() (emailUtil: EmailUtil) extends Controller {

  def register = Action.async { implicit request =>
    UsersForms.registerForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      providedInfos => {
        User.store(providedInfos) map (optUser =>
          optUser.map(user =>
            Ok(Json.obj("token" -> user.token))
          )
            getOrElse BadRequest("An error occurred when inserting data"))
      }
    )
  }

  def login = Action.async { implicit request =>
    UsersForms.loginForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      login => {
        withCheckedPassword(login.email, login.password) {
            User.findByEmail(login.email) flatMap (_ map (user => User.generateAndStoreNewToken(user) map (user => Ok(Json.obj("token" -> user.token))))
              getOrElse Future.successful(BadRequest("Unknown Error")))
        }
      }
    )
  }

  def isUsed(email: String) = Action.async {
    User.findByEmail(email) map {
      case None => Ok(Json.obj("ok" -> false))
      case Some(user) => Ok(Json.obj("ok" -> true))
    }
  }

  def userData = HasToken.async { implicit request =>
    User.findByEmail(request.headers.get("USER").getOrElse("")) map ( _.map (user => Ok(Json.toJson(user))) getOrElse Utils.responseOnWrongDataSent)
  }

  def updatePassword = HasToken.async { implicit request =>
    UsersForms.updatePasswordForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      infos => {
        val email: String = request.headers.get("USER").getOrElse("")
        withCheckedPassword(email, infos.oldPassword) {
            UserSecurity
              .update(UserSecurity.factory(email, infos.newPassword))
              .map (user => Ok(""))
        }
      }
    )
  }

  def sendEmail = Action.async { implicit request =>
    UsersForms.sendEmailForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      sendEmail =>
          UserSecurity.findByEmail(sendEmail.email) flatMap (_ map (userSecurity => UserSecurity.generateAndStoreNewTokenForgotPassword(userSecurity) map (userSecurity => {
            emailUtil.sendEmailForgotPassword(userSecurity._id, userSecurity.tokenForgotPassword.get)
            Ok("")
          }))
            getOrElse Future.successful(Ok("")))
    )
  }

  def reinitializePassword = Action.async { implicit request =>
    UsersForms.reinitializePasswordForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      infos => {
          UserSecurity.findTokenForgotPassword(infos.tokenForgotPassword) flatMap (_.map (userSecurity => {
            UserSecurity.update(userSecurity.copy(password = Hash.createPassword(infos.newPassword), tokenForgotPassword = None)) map (user => Ok(""))
          }) getOrElse Future.successful( BadRequest("Wrong token. You will be redirected.") ))

      }
    )
  }

  def updatePersonalData() = HasToken.async { implicit request =>
    UsersForms.updatePersonalData.bindFromRequest.fold(
      Utils.badRequestOnError,
      data => {
        User.findByEmail(request.headers.get("USER").getOrElse("")) flatMap (_.map (user => {
          User.update(user.copy(firstName = data.firstName, lastName = data.lastName, birthday = data.birthday)) map (user => Ok(""))
        }) getOrElse Future.successful( Utils.responseOnWrongDataSent ))
      }
    )
  }

  def destroyAccount() = HasToken.async { implicit request =>
    UsersForms.destroyAccountForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      data => {
        val email: String = request.headers.get("USER").getOrElse("")
        withCheckedPassword(email, data.password) {
            for {
              passwordDeleted <- UserSecurity.delete(email)
              userDeleted <- User.delete(email) if passwordDeleted
            }
            yield {
              if (userDeleted) Ok("") else BadGateway("")
            }
        }
      }
    )
  }

  def withCheckedPassword(email: String, password: String)(safeCallback: => Future[Result]) = {
    UserSecurity.findByEmail(email) flatMap (_ map (userPassword =>
      if (Hash.checkPassword(password, userPassword.password)) {
        safeCallback
      }
      else {
        Future.successful( BadRequest("Wrong password") )
      }
      ) getOrElse Future.successful( BadRequest("Wrong email") )
      )
  }

  def checkToken() = HasToken {
    Ok("")
  }
}
