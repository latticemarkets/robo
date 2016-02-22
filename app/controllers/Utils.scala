/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers

import play.api.data.Form
import play.api.mvc.{Controller, Result}

import scala.concurrent.Future

/**
  * @author : julienderay
  * Created on 22/02/2016
  */

object Utils extends Controller {
  def badRequestOnError[T]: (Form[T]) => Future[Result] = {
    formWithErrors => Future.successful(BadRequest("Wrong data sent."))
  }
}
