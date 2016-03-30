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

  def sendEmailAddressConfirmation(email: String, firstName: String, lastName: String): Unit = {
    val emailObj = Email(
      "Please confirm your email address to PDX Technology",
      "PDX Technology <noanswer@pdx.technology>",
      Seq(s"$firstName $lastName <$email>"),
      bodyText = Some("A text message"),
      bodyHtml = Some(s"""<html><body><p>An <b>html</b> message</p></body></html>""")
    )
    mailerClient.send(emailObj)
  }
}
