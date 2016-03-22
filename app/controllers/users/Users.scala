/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.users

import controllers.Security.HasToken
import controllers.Utils
import core.Formatters._
import core.Hash
import models.{UserSecurity, User}
import play.api.libs.json.Json
import play.api.mvc._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * @author : julienderay
  * Created on 27/01/2016
  */

class Users extends Controller {

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
        UserSecurity.findByEmail(login.email) flatMap (_ map (userPassword =>
          if (Hash.checkPassword(login.password, userPassword.password)) {
            User.findByEmail(login.email) flatMap (_ map (user => User.generateAndStoreNewToken(user) map (user => Ok(Json.obj("token" -> user.token))))
              getOrElse Future.successful(BadRequest("Unknown Error")))
          }
          else {
            Future.successful( BadRequest("Wrong password") )
          }
        ) getOrElse Future.successful( BadRequest("Wrong email") )
        )
      }
    )
  }

  def isUsed(email: String) = Action.async {
    User.findByEmail(email) map {
      case None => Ok(Json.obj("ok" -> true))
      case Some(user) => Ok(Json.obj("ok" -> false))
    }
  }

  def userData = HasToken.async { implicit request =>
    User.findByEmail(request.headers.get("USER").getOrElse("")) map ( _.map (user => Ok(Json.toJson(user))) getOrElse Utils.responseOnWrongDataSent)
  }

  def updatePassword = HasToken.async { implicit request =>
    UsersForms.updatePasswordForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      infos => {
        UserSecurity.findByEmail(request.headers.get("USER").getOrElse("")) flatMap (optUser => optUser map (user =>
          if (Hash.checkPassword(infos.oldPassword, user.password)) {
            UserSecurity.update(user.copy(password = Hash.createPassword(infos.newPassword)))
              .map (user => Ok(""))
          }
          else {
            Future.successful( BadRequest("Old password incorrect") )
          }
          ) getOrElse Future.successful( BadRequest("Wrong email") )
          )
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
        val email = request.headers.get("USER").getOrElse("")
        UserSecurity.findByEmail(email) flatMap (_ map (user =>
          if (Hash.checkPassword(data.password, user.password)) {
            for {
              passwordDeleted <- UserSecurity.delete(email)
              userDeleted <- User.delete(email) if passwordDeleted
            }
            yield {
              if (userDeleted) Ok("") else BadGateway("")
            }
          }
          else {
            Future.successful( BadRequest("Incorrect password") )
          }
          ) getOrElse Future.successful( BadGateway("") )
          )
      }
    )
  }

  def checkToken() = HasToken {
    Ok("")
  }
}
