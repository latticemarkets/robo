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
import models.User
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
        User.findByEmail(data.email) flatMap (_.map (user => {
          User.update(user.copy(platforms = data.platforms)) map (user => Ok(""))
        }) getOrElse Future.successful( Utils.responseOnWrongDataSent ))
      }
    )
  }

  def addPlatform() = HasToken.async { implicit request =>
    PlatformsForms.addPlatformForm.bindFromRequest.fold(
      Utils.badRequestOnError[AddPlatform],
      data => {
        User.findByEmail(data.email) flatMap (_.map (user => {
          User.update(user.copy(platforms = user.platforms :+ data.platform)) map (user => Ok(""))
        }) getOrElse Future.successful( Utils.responseOnWrongDataSent ))
      }
    )
  }

}
