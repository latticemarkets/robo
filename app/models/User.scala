/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package models

import java.util.Date

import controllers.users.RegisterForm
import core.Formatters._
import core.{DbUtil, Hash}
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.json._
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
 * @author : julienderay
 * Created on 27/01/2016
 */

case class User(
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
  def withEncryptedPassword: User = this.copy(password = Hash.createPassword(this.password))
}

case class Login(
  email: String,
  password: String)

case class UpdatePassword(oldPassword: String, newPassword: String)

case class UpdatePersonalData(firstName: String, lastName: String, birthday: Date)

case class DestroyAccount(password: String)

object User {

  val collectionName = "user"

  val usersTable: JSONCollection = DbUtil.db.collection(collectionName)

  def findByEmail(email: String) = usersTable.find(Json.obj("_id" -> email)).one[User]

  def store(user: User) = { // Todo : handle the case where primary key is violated
    for {
      result <- usersTable.insert(Json.toJson(user.withEncryptedPassword).as[JsObject])
      newUser <- findByEmail(user._id) if result.ok
    } yield newUser
  }

  def getByToken(token: String): Future[Option[User]] = {
    val query = Json.obj("token" -> token)
    usersTable.find(query).one[User]
  }

  def generateAndStoreNewToken(user: User): Future[User] = {
    val updatedUser: User = user.copy(token = Hash.createToken)
    update(updatedUser)
  }

  def update(user: User): Future[User] = {
    val selector = Json.obj("_id" -> user._id)
    val modifier = Json.toJson(user).as[JsObject]

    usersTable.update(selector, modifier) map (_ => user)
  }

  def delete(email: String): Future[Boolean] = usersTable.remove(Json.obj("_id" -> email)) map (_.ok)

  def factory(form: RegisterForm): User = User(
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

object Reason extends Enumeration {
  type Reason = Value
  val longterm, shortterm, majorpurchase, children, general = Value

  def isReasonType(s: String) = values.exists(_.toString == s)
}

object YearlyIncome extends Enumeration {
  type YearlyIncomeType = Value
  val lessThan25 = Value("-25")
  val from25To50 = Value("25-50")
  val from50To100 = Value("50-100")
  val from100To250 = Value("100-250")
  val moreThan250 = Value("+250")

  def isYearlyIncomeType(s: String) = values.exists(_.toString == s)
}

object Timeline extends Enumeration {
  type TimelineType = Value
  val lessThan5 = Value("-5")
  val from5To10 = Value("5-10")
  val from10To15 = Value("10-15")
  val from15To25 = Value("15-25")
  val moreThan25 = Value("+25")

  def isTimelineType(s: String) = values.exists(_.toString == s)
}