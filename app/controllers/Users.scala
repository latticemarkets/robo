/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers

import controllers.Security.HasToken
import core.{Hash, Forms}
import models.User
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  * Created on 27/01/2016
  */

class Users extends Controller {

  def register = Action.async { implicit request =>
    Forms.registerForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful( BadRequest("Wrong data sent.") )
      },
      providedInfos => {
        User.store(providedInfos) map (optUser => optUser.map(user => Ok(Json.obj("token" -> user.token))).getOrElse(BadRequest("An error occurred when inserting data")))
      }
    )
  }

  def login = Action.async { implicit request =>
    Forms.loginForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful( BadRequest("Wrong data sent.") )
      },
      login => {
        User.findByEmail(login.email) map (optUser => optUser map (user =>
          if (Hash.checkPassword(login.password, user.password)) {
            Ok(Json.obj("token" -> user.token))
          }
          else {
            BadRequest("Wrong password")
          }
        ) getOrElse BadRequest("Wrong email")
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

  def availableCapital() = HasToken {
    Ok(Json.obj("availableCapital" -> 200000))
  }

  def allocatedCapital() = HasToken {
    Ok(Json.obj("allocatedCapital" -> 300000))
  }

  def userInformations(email: String) = HasToken.async {
    User.findByEmail(email) map (user => Ok(Json.toJson(user)))
  }
}
