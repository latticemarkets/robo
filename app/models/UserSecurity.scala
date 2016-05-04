/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package models

import com.google.inject.Inject
import com.google.inject.Singleton
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

case class UserSecurityModel(
                         _id: String,
                         password: String,
                         tokenForgotPassword: Option[String],
                         tokenConfirmEmail: Option[String]
                       ) {
  def withEncryptedPassword: UserSecurityModel = this.copy(password = Hash.createPassword(this.password))
}

case class UpdatePassword(oldPassword: String, newPassword: String)

case class ReinitializePassword(tokenForgotPassword: String, newPassword: String)

@Singleton class UserSecurity @Inject() (dbUser: DbUtil) {
  val collectionName = "usersecurity"

  val userSecurityTable: JSONCollection = dbUser.db.collection(collectionName)

  def findByEmail(email: String) = userSecurityTable.find(Json.obj("_id" -> email)).one[UserSecurityModel]

  def store(userSecurity: UserSecurityModel) = {
    for {
      result <- userSecurityTable.insert(Json.toJson(userSecurity).as[JsObject])
      newUser <- findByEmail(userSecurity._id) if result.ok
    } yield newUser
  }

  def update(userSecurity: UserSecurityModel): Future[UserSecurityModel] = {
    val selector = Json.obj("_id" -> userSecurity._id)
    val modifier = Json.toJson(userSecurity).as[JsObject]

    userSecurityTable.update(selector, modifier) map (_ => userSecurity)
  }

  def factory(email: String, password: String): UserSecurityModel = UserSecurityModel(email, password, None, Option(Hash.createToken)).withEncryptedPassword

  def delete(email: String): Future[Boolean] = userSecurityTable.remove(Json.obj("_id" -> email)) map (_.ok)

  def findTokenForgotPassword(tokenForgotPassword: String) = userSecurityTable.find(Json.obj("tokenForgotPassword" -> tokenForgotPassword)).one[UserSecurityModel]

  def findTokenConfirmEmail(tokenConfirmEmail: String) = userSecurityTable.find(Json.obj("tokenConfirmEmail" -> tokenConfirmEmail)).one[UserSecurityModel]

  def generateAndStoreNewTokenForgotPassword(userSecurity: UserSecurityModel): Future[UserSecurityModel] = {
    val updatedUserSecurity: UserSecurityModel = userSecurity.copy(tokenForgotPassword = Option(Hash.createToken))
    update(updatedUserSecurity)
  }
}
