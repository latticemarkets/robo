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

  def sendEmailForgotPassword(email: String, tokenForgotPassword: String): Unit = {
    val message = s"Please follow this link in order to reinitialize your password : https://pdx-robo.herokuapp.com/dashboard#/reinitializePassword/%3F$tokenForgotPassword"

    val emailObj = Email(
      "PDX Technology <noanswer@pdx.technology>",
      s"<$email>",
      bodyText = Some(message),
      bodyHtml = Some(s"""<html><body><p>$message</p></body></html>""")
    )
    mailerClient.send(emailObj)
  }

  def sendEmailConfirmEmail(firstName: String, lastName: String, email: String, tokenConfirmEmail: String) {
    val message = s"Please follow this link in order to confirm your email address and finalize the creation of your account : https://pdx-robo.herokuapp.com/dashboard#/confirmEmail/%3F$tokenConfirmEmail"

    val emailObj = Email(
      "Please confirm email | PDX Technology",
      "PDX Technology <noanswer@pdx.technology>",
      Seq(s"$firstName, $lastName <$email>"),
      bodyText = Some(message),
      bodyHtml = Some(s"""<html><body><p>$message</p></body></html>""")
    )
    mailerClient.send(emailObj)
  }
}
