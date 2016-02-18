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
  * Created on 18/02/2016
  */
object MarketType extends Enumeration {
  type MarketType = Value
  val primary, secondary = Value
}

case class Market(
                 strategy: String,
                 rules: Seq[Rule]
                 )