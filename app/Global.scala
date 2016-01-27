import play.{GlobalSettings, Logger}
import core.DbUtil

/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
  * @author : julienderay
  * Created on 27/01/2016
  */

class Global extends GlobalSettings {
  def onStop(app: play.api.Application) {
    Logger.info("Application shutdown...")
    DbUtil.closeDriver()
  }
}
