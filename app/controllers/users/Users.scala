/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.users

import javax.inject.Inject

import controllers.{Security, Utils}
import core.Formatters._
import core.Hash
import models.User
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * @author : julienderay
  * Created on 27/01/2016
  */

class Users @Inject() (dbUser: User, security: Security) extends Controller {

  def register = Action.async { implicit request =>
    UsersForms.registerForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      providedInfos => {
        dbUser.store(
          dbUser.factory(providedInfos)
        ) map (optUser =>
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
        dbUser.findByEmail(login.email) flatMap (optUser => optUser map (user =>
          if (Hash.checkPassword(login.password, user.password)) {
            dbUser.generateAndStoreNewToken(user) map (user => Ok(Json.obj("token" -> user.token)))
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
    dbUser.findByEmail(email) map {
      case None => Ok(Json.obj("ok" -> true))
      case Some(user) => Ok(Json.obj("ok" -> false))
    }
  }

  def userData = security.HasToken.async { implicit request =>
    dbUser.findByEmail(request.headers.get("USER").getOrElse("")) map ( _.map (user => Ok(Json.toJson(user))) getOrElse Utils.responseOnWrongDataSent)
  }

  def updatePassword = security.HasToken.async { implicit request =>
    UsersForms.updatePasswordForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      infos => {
        dbUser.findByEmail(request.headers.get("USER").getOrElse("")) flatMap (optUser => optUser map (user =>
          if (Hash.checkPassword(infos.oldPassword, user.password)) {
            dbUser.update(user.copy(password = Hash.createPassword(infos.newPassword)))
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

  def updatePersonalData() = security.HasToken.async { implicit request =>
    UsersForms.updatePersonalData.bindFromRequest.fold(
      Utils.badRequestOnError,
      data => {
        dbUser.findByEmail(request.headers.get("USER").getOrElse("")) flatMap (_.map (user => {
          dbUser.update(user.copy(firstName = data.firstName, lastName = data.lastName, birthday = data.birthday)) map (user => Ok(""))
        }) getOrElse Future.successful( Utils.responseOnWrongDataSent ))
      }
    )
  }

  def destroyAccount() = security.HasToken.async { implicit request =>
    UsersForms.destroyAccountForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      data => {
        val email = request.headers.get("USER").getOrElse("")
        dbUser.findByEmail(email) flatMap (optUser => optUser map (user =>
          if (Hash.checkPassword(data.password, user.password)) {
            dbUser.delete(email) map (deleted => if (deleted) Ok("") else BadGateway(""))
          }
          else {
            Future.successful( BadRequest("Incorrect password") )
          }
          ) getOrElse Future.successful( BadGateway("") )
          )
      }
    )
  }

  def checkToken() = security.HasToken {
    Ok("")
  }
}
