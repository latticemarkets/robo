/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package models

import java.util.Date
import javax.inject.Inject
import javax.inject.Singleton

import controllers.users.RegisterForm
import core.{DbUtil, Hash}
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.json._
import reactivemongo.play.json.collection.JSONCollection

import core.Formatters._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
 * @author : julienderay
 * Created on 27/01/2016
 */

case class UserModel(
    _id: String,
    password: String,
    terms: String,
    reason: String,
    income: String,
    timeline: String,
    birthday: Date,
    platforms: Seq[Platform],
    firstName: String,
    lastName: String,
    token: String) {
  def withEncryptedPassword: UserModel = this.copy(password = Hash.createPassword(this.password))
}

case class Login(
  email: String,
  password: String)

case class UpdatePassword(oldPassword: String, newPassword: String)

case class UpdatePersonalData(firstName: String, lastName: String, birthday: Date)

case class DestroyAccount(password: String)

@Singleton class User @Inject() (dbUtil: DbUtil) {

  val collectionName = "user"

  val usersTable: JSONCollection = dbUtil.db.collection(collectionName)

  def findByEmail(email: String) = usersTable.find(Json.obj("_id" -> email)).one[UserModel]

  def store(user: UserModel): Future[Option[UserModel]] = { // Todo : handle the case where primary key is violated
    for {
      result <- usersTable.insert(Json.toJson(user.withEncryptedPassword).as[JsObject])
      newUser <- findByEmail(user._id) if result.ok
    } yield newUser
  }

  def getByToken(token: String): Future[Option[UserModel]] = {
    val query = Json.obj("token" -> token)
    usersTable.find(query).one[UserModel]
  }

  def generateAndStoreNewToken(user: UserModel): Future[UserModel] = {
    val updatedUser: UserModel = user.copy(token = Hash.createToken)
    update(updatedUser)
  }

  def update(user: UserModel): Future[UserModel] = {
    val selector = Json.obj("_id" -> user._id)
    val modifier = Json.toJson(user).as[JsObject]

    usersTable.update(selector, modifier) map (_ => user)
  }

  def delete(email: String): Future[Boolean] = usersTable.remove(Json.obj("_id" -> email)) map (_.ok)

  def factory(form: RegisterForm): UserModel = UserModel(
    form.email,
    form.password,
    form.terms,
    form.reason,
    form.income,
    form.timeline,
    form.birthday,
    form.platforms.map(p => Platform.factory(p.originator, p.accountId, p.apiKey)),
    form.firstName,
    form.lastName,
    Hash.createToken
  )
}