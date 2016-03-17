/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package core


import javax.inject.Inject
import javax.inject.Singleton

import play.api.Play.current
import play.api.inject.ApplicationLifecycle
import play.modules.reactivemongo.ReactiveMongoApi

import scala.concurrent.Future
import scala.concurrent.duration.DurationInt
import scala.language.postfixOps

/**
  * @author : julienderay
  * Created on 27/01/2016
  */
@Singleton class DbUtil @Inject() (applicationLifecycle: ApplicationLifecycle)  {
  lazy val reactiveMongoApi = current.injector.instanceOf[ReactiveMongoApi]

  val timeout = 5 seconds
  val timeoutMillis = timeout.toMillis.toInt

  lazy val db = reactiveMongoApi.db

  def closeDriver(): Unit = try {
    reactiveMongoApi.driver.close()
  } catch { case _: Throwable => () }

  applicationLifecycle.addStopHook { () =>
    Future.successful(closeDriver())
  }
}

