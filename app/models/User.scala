/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package models

import java.util.Date

import core.{Hash, DbUtil}
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.json._
import play.modules.reactivemongo.json.collection.JSONCollection

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  * Created on 27/01/2016
  */

case class User(
               email: String,
               password: String,
               terms: String,
               reason: String,
               income: String,
               timeline: String,
               birthday: Date,
               platform: String,
               accountId: String,
               apiKey: String,
               firstName: String,
               lastName: String,
               token: String
               ){
  def withEncryptedPassword: User = this.copy(password = Hash.createPassword(this.password))
}

object User {
  val collectionName = "user"

  implicit val accountSummaryFormat = Json.format[User]

  val usersTable: JSONCollection = DbUtil.db.collection(collectionName)

  def findByEmail(email: String) = usersTable.find(Json.obj("email" -> email)).one[User]

  def store(user: User) = {
    for {
      result <- usersTable.insert(Json.toJson(user.withEncryptedPassword).as[JsObject])
      newUser <- findByEmail(user.email) if result.ok
    }
      yield newUser
  }
}