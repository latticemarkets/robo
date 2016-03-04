/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.platforms

import controllers.Security.HasToken
import controllers.Utils
import models._
import core.Formatters._
import play.api.libs.json.Json
import play.api.mvc.Controller

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * @author : julienderay
  * Created on 22/02/2016
  */

class Platforms extends Controller {
  def updatePlatforms() = HasToken.async { implicit request =>
    PlatformsForms.updatePlatformsForm.bindFromRequest.fold(
      Utils.badRequestOnError[UpdatePlatforms],
      data => {
        User.findByEmail(request.headers.get("USER").getOrElse("")) flatMap (_.map (user => {
          User.update(user.copy(platforms = data.platforms)) map (user => Ok(""))
        }) getOrElse Future.successful( Utils.responseOnWrongDataSent ))
      }
    )
  }

  def addPlatform() = HasToken.async { implicit request =>
    PlatformsForms.addPlatformForm.bindFromRequest.fold(
      Utils.badRequestOnError[AddPlatform],
      data => {
        User.findByEmail(request.headers.get("USER").getOrElse("")) flatMap (_.map (user => {
          val newPlatform = Platform.factory(data.platform.originator, data.platform.accountId, data.platform.apiKey)
          User.update(user.copy(platforms = user.platforms :+ newPlatform)) map (user => Ok(""))
        }) getOrElse Future.successful( Utils.responseOnWrongDataSent ))
      }
    )
  }

  def getPlatforms = HasToken.async { implicit request =>
    User.findByEmail(request.headers.get("USER").getOrElse("")) map (_.map(user => Ok(Json.toJson(user.platforms))) getOrElse Utils.responseOnWrongDataSent)
  }

  def updatePlatform() = HasToken.async { implicit request =>
    PlatformsForms.updatePlatformForm.bindFromRequest.fold(
      Utils.badRequestOnError[UpdatePlatform],
      data => {
        User.findByEmail(data.email) flatMap (_.map (user => {
          User.update(user.copy(platforms = user.platforms.map(p =>
            if (p.originator == data.platform.originator) data.platform else p)
          )) map (user => Ok(""))
        }) getOrElse Future.successful( Utils.responseOnWrongDataSent ))
      }
    )
  }

}
