/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.strategies

import controllers.Security.HasToken
import models.User
import play.api.mvc.Controller

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
/**
  * @author : julienderay
  * Created on 22/02/2016
  */

class Strategies extends Controller {

  def updatePrimaryMarketBuyStrategies() = HasToken.async { implicit request =>
    StrategiesForms.updatePrimaryMarketBuyStrategiesForm.bindFromRequest.fold(
      formWithErrors => Future.successful( BadRequest("Wrong data sent.") ),
      data => {
        User.findByEmail(data.email) flatMap (_.map (user => {
          user.platforms.find(_.originator == data.platform) map (platform => {
            val updatedPlatform = platform.copy(primary = platform.primary.copy(buyStrategies = data.strategies))
            val platforms = user.platforms.map {
              case p if p.originator == data.platform => updatedPlatform
              case p => p
            }
            User.update(user.copy(platforms = platforms)) map (user => Ok(""))
          }) getOrElse Future.successful( BadGateway("") )
        }) getOrElse Future.successful( BadGateway("") ))
      }
    )
  }
}
