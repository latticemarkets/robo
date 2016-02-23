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

class Users extends Controller {

  def register = Action.async { implicit request =>
    UsersForms.registerForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      providedInfos => {
        User.store(
          User.factory(providedInfos)
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
        User.findByEmail(login.email) flatMap (optUser => optUser map (user =>
          if (Hash.checkPassword(login.password, user.password)) {
            User.generateAndStoreNewToken(user) map (user => Ok(Json.obj("token" -> user.token)))
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

  def userData(email: String) = HasToken.async {
    User.findByEmail(email) map ( _.map (user => Ok(Json.toJson(user))) getOrElse Utils.responseOnWrongDataSent)
  }

  def portfolioSuggestion() = Action {
    Ok(Json.obj("portfolio" -> "moderate"))
  }

  def updatePassword() = HasToken.async { implicit request =>
    UsersForms.updatePasswordForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      infos => {
        User.findByEmail(infos.email) flatMap (optUser => optUser map (user =>
          if (Hash.checkPassword(infos.oldPassword, user.password)) {
            User.update(user.copy(password = Hash.createPassword(infos.newPassword)))
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
        User.findByEmail(data.email) flatMap (_.map (user => {
          User.update(user.copy(firstName = data.firstName, lastName = data.lastName, birthday = data.birthday)) map (user => Ok(""))
        }) getOrElse Future.successful( Utils.responseOnWrongDataSent ))
      }
    )
  }

  def destroyAccount() = HasToken.async { implicit request =>
    UsersForms.destroyAccountForm.bindFromRequest.fold(
      Utils.badRequestOnError,
      data => {
        User.findByEmail(data.email) flatMap (optUser => optUser map (user =>
          if (Hash.checkPassword(data.password, user.password)) {
            User.delete(data.email) map (deleted => if (deleted) Ok("") else BadGateway(""))
          }
          else {
            Future.successful( BadRequest("Incorrect password") )
          }
          ) getOrElse Future.successful( BadGateway("") )
          )
      }
    )
  }
}
