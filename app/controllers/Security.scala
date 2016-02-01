/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers


import models.User
import play.api.mvc._

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  * Created on 01/02/2016
  */

object Security {
  case class TokenRequest[A](token: String, request: Request[A]) extends WrappedRequest[A](request)

  private[controllers] object HasToken extends ActionBuilder[TokenRequest] {
    def invokeBlock[A](request: Request[A], block: (TokenRequest[A]) => Future[Result]) = {
      val email = request.headers.get("USER").getOrElse("")

      request.headers.get("X-TOKEN") map { token =>
        User.getByToken( token ).flatMap {
          case Some(user) if user._id == email => block(TokenRequest(user.token, request))
          case _                               => Future.successful( Results.Unauthorized("401 Unauthorized\n") )
        }
      } getOrElse {
        Future.successful(Results.Unauthorized("401 No Security Token\n"))
      }
    }
  }
}