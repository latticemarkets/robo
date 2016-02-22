/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package models

/**
  * @author : julienderay
  * Created on 22/02/2016
  */

case class Platform(
       originator: String,
       accountId: String,
       apiKey: String,
       primary: Market,
       secondary: Market,
       autoEnabled: Boolean
     ) {
  def originatorEnum = OriginatorEnum.withName(originator)
}