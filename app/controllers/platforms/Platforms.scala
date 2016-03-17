/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.platforms

import javax.inject.Inject

import controllers.{Security, Utils}
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

class Platforms @Inject() (dbUser: User, security: Security) extends Controller {
  def updatePlatforms() = security.HasToken.async { implicit request =>
    PlatformsForms.updatePlatformsForm.bindFromRequest.fold(
      Utils.badRequestOnError[UpdatePlatforms],
      data => {
        dbUser.findByEmail(request.headers.get("USER").getOrElse("")) flatMap (_.map (user => {
          dbUser.update(user.copy(platforms = data.platforms)) map (user => Ok(""))
        }) getOrElse Future.successful( Utils.responseOnWrongDataSent ))
      }
    )
  }

  def addPlatform() = security.HasToken.async { implicit request =>
    PlatformsForms.addPlatformForm.bindFromRequest.fold(
      Utils.badRequestOnError[AddPlatform],
      data => {
        dbUser.findByEmail(request.headers.get("USER").getOrElse("")) flatMap (_.map (user => {
          val newPlatform = Platform.factory(data.platform.originator, data.platform.accountId, data.platform.apiKey)
          dbUser.update(user.copy(platforms = user.platforms :+ newPlatform)) map (user => Ok(""))
        }) getOrElse Future.successful( Utils.responseOnWrongDataSent ))
      }
    )
  }

  def getPlatforms = security.HasToken.async { implicit request =>
    dbUser.findByEmail(request.headers.get("USER").getOrElse("")) map (_.map(user => Ok(Json.toJson(user.platforms))) getOrElse Utils.responseOnWrongDataSent)
  }

  def updatePlatform() = security.HasToken.async { implicit request =>
    PlatformsForms.updatePlatformForm.bindFromRequest.fold(
      Utils.badRequestOnError[UpdatePlatform],
      data => {
        dbUser.findByEmail(request.headers.get("USER").getOrElse("")) flatMap (_.map (user => {
          dbUser.update(user.copy(platforms = user.platforms.map(p =>
            if (p.originator == data.platform.originator) data.platform else p)
          )) map (user => Ok(""))
        }) getOrElse Future.successful( Utils.responseOnWrongDataSent ))
      }
    )
  }

}
