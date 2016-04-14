/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package models

import core.Formatters.userSecurityFormat
import core.{DbUtil, Hash}
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.json._
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * @author : julienderay
  * Created on 22/03/2016
  */

case class UserSecurity(
                         _id: String,
                         password: String,
                         tokenForgotPassword: Option[String]
                       ) {
  def withEncryptedPassword: UserSecurity = this.copy(password = Hash.createPassword(this.password))
}

case class UpdatePassword(oldPassword: String, newPassword: String)

case class ReinitializePassword(newPassword: String)

object UserSecurity {
  val collectionName = "usersecurity"

  val userSecurityTable: JSONCollection = DbUtil.db.collection(collectionName)

  def findByEmail(email: String) = userSecurityTable.find(Json.obj("_id" -> email)).one[UserSecurity]

  def store(userSecurity: UserSecurity) = {
    for {
      result <- userSecurityTable.insert(Json.toJson(userSecurity).as[JsObject])
      newUser <- findByEmail(userSecurity._id) if result.ok
    } yield newUser
  }

  def update(userSecurity: UserSecurity): Future[UserSecurity] = {
    val selector = Json.obj("_id" -> userSecurity._id)
    val modifier = Json.toJson(userSecurity).as[JsObject]

    userSecurityTable.update(selector, modifier) map (_ => userSecurity)
  }

  def factory(email: String, password: String): UserSecurity = UserSecurity(email, password, None).withEncryptedPassword

  def delete(email: String): Future[Boolean] = userSecurityTable.remove(Json.obj("_id" -> email)) map (_.ok)

  def findTokenForgotPassword(tokenForgotPassword: String) = userSecurityTable.find(Json.obj("tokenForgotPassword" -> tokenForgotPassword)).one[UserSecurity]

  def generateAndStoreNewTokenForgotPassword(userSecurity: UserSecurity): Future[UserSecurity] = {
    val updatedUserSecurity: UserSecurity = userSecurity.copy(tokenForgotPassword = Option(Hash.createToken))
    update(updatedUserSecurity)
  }

  def destroyTokenForgotPassword(userSecurity: UserSecurity): Future[UserSecurity] = {
    val updatedUserSecurity: UserSecurity = userSecurity.copy(tokenForgotPassword = None)
    update(updatedUserSecurity)
  }
}
