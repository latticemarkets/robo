/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers

import models.{CriterionType, Criteria}
import play.api.libs.json.Json
import play.api.mvc._
import controllers.Security.HasToken

/**
  * @author : julienderay
  * Created on 27/01/2016
  */

class Criteria extends Controller {
  implicit val criterionTypeFormat = Json.format[CriterionType]

  def criteraTypes = HasToken {
    Ok(Json.toJson(Criteria.criteriaTypes))
  }
}
