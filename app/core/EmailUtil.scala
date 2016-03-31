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

  def sendEmailAddressConfirmation(email: String, firstName: String, lastName: String, token: String): Unit = {
    val message = s"Please follow this link in order to confirm your email address : https://pdx-robo.herokuapp.com/api/user/confirm/$token"

    val emailObj = Email(
      "Please confirm your email address to PDX Technology",
      "PDX Technology <noanswer@pdx.technology>",
      Seq(s"$firstName $lastName <$email>"),
      bodyText = Some(message),
      bodyHtml = Some(s"""<html><body><p>$message</p></body></html>""")
    )
    mailerClient.send(emailObj)
  }
}
