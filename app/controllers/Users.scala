/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers

import core.Forms
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
    Forms.loginForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful( BadRequest("Wrong data sent.") )
      },
      providedInfos => {
        User.store(providedInfos) map (optUser => optUser.map(user => Ok(Json.obj("token" -> user.token))).getOrElse(BadRequest("An error occurred when inserting data")))
      }
    )
  }
}
