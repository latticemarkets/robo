/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package core

import javax.inject.{Singleton, Inject}
import play.api.libs.mailer._

/**
  * @author : julienderay
  * Created on 30/03/2016
  */

@Singleton class EmailUtil @Inject() (mailerClient: MailerClient) {

  def sendEmailForgotPassword(email: String, tokenForgotPassword: String, firstName: String, lastName: String): Unit = {
    val message = s"Hello ${firstName.capitalize} ${lastName.capitalize},<br /> Please follow this link in order to reinitialize your password : <br /> <a href='https://pdx-robo.herokuapp.com/dashboard#/reinitializePassword/%3F$tokenForgotPassword'>https://pdx-robo.herokuapp.com/dashboard#/reinitializePassword/%3F$tokenForgotPassword</a>"

    val emailObj = Email(
      "Forgot your password | PDX Technology",
      "PDX Technology <noanswer@pdx.technology>",
      Seq(s"$firstName $lastName <$email>"),
      bodyText = Some(message),
      bodyHtml = Some(s"""<html><body><p>$message</p></body></html>""")
    )
    mailerClient.send(emailObj)
  }
}
