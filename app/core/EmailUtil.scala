/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package core

import net.kaliber.mailer._

/**
  * @author : julienderay
  * Created on 30/03/2016
  */

object EmailUtil {

  def sendEmailAddressConfirmation(email: String, firstName: String, lastName: String): Unit = {
    val emailObj = Email(
      subject = "Please confirm your email address to PDX Technology",
      from = EmailAddress("Confirm - PDX Technology", "confirm@pdx.technology"),
      text = "text",
      htmlText = "htmlText")
      .to(s"$firstName $lastName", email)
  }
}
