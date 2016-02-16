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
  * Created on 12/02/2016
  */

case class Rule(
               id: String,
               name: String,
               expectedReturn: ExpectedReturn,
               loansAvailablePerWeek: BigDecimal,
               moneyAvailablePerWeek: BigDecimal,
               criteria: Seq[Criterion],
               pause: Boolean
               )

case class ExpectedReturn(
                         value: BigDecimal,
                         percent: BigDecimal,
                         margin: BigDecimal
                         )