/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers

import models.{OriginatorEnum, TimelineEnum, ReasonEnum, YearlyIncomeEnum}
import play.api.data.validation.{Constraint, Invalid, Valid, ValidationError}

/**
  * @author : julienderay
  * Created on 16/03/2016
  */

object Constraints {

  val containsLowerCase: (String => Boolean, ValidationError) = (password => password.matches("""^(?=.*[a-z]).+$""".r.regex), ValidationError("Password does not contain any lower case"))
  val containsUpperCase: (String => Boolean, ValidationError) = (password => password.matches("""^(?=.*[A-Z]).+$""".r.regex), ValidationError("Password does not contain any upper case"))
  val containsSpecialChar: (String => Boolean, ValidationError) = (password => password.matches("""^(?=.*[0-9_\W]).+$""".r.regex), ValidationError("Password does not contain any special character"))
  val containsAtLeast8Chars: (String => Boolean, ValidationError) = (password => password.length >= 8, ValidationError("Password contains less than 8 characters"))

  val passwordCheckConstraint: Constraint[String] = Constraint("constraints.passwordCheck")({
    plainText =>
      val errors = Seq(containsLowerCase, containsUpperCase, containsSpecialChar, containsAtLeast8Chars).filter{ case (check, error) => !check(plainText)}.map(_._2)

      if (errors.isEmpty) {
        Valid
      }
      else {
        Invalid(errors)
      }
  })

  val isTrue: Constraint[String] = Constraint("constraints.terms")({
    case plainText if plainText == "true" => Valid
    case _ => Invalid(ValidationError("Terms have not been accepted"))
  })

  val reasonCheck: Constraint[String] = Constraint("constraints.reason")({
    reason => if (ReasonEnum.isReasonType(reason)) Valid else Invalid(ValidationError("Invalid reason"))
  })

  val yearlyIncomeCheck: Constraint[String] = Constraint("constraints.yearlyIncome")({
    yearlyIncome => if (YearlyIncomeEnum.isYearlyIncomeType(yearlyIncome)) Valid else Invalid(ValidationError("Invalid yearly income"))
  })

  val timelineCheck: Constraint[String] = Constraint("constraints.timeline")({
    timeline => if (TimelineEnum.isTimelineType(timeline)) Valid else Invalid(ValidationError("Invalid timeline"))
  })

  val originatorCheck: Constraint[String] = Constraint("constraints.originator")({
    originator => if (OriginatorEnum.isOriginatorType(originator)) Valid else Invalid(ValidationError("Invalid originator"))
  })

  val bigDecimalPositiveCheck: Constraint[BigDecimal] = Constraint("constraints.bigDecimalPositive")({
    case number if number >= 0 => Valid
    case _ => Invalid(ValidationError("Negative number given"))
  })

  val aggressivityCheck: Constraint[BigDecimal] = Constraint("constraints.aggressivity")({
    case aggressivity if aggressivity >= 0 && aggressivity <= 1 => Valid
    case _ => Invalid(ValidationError("Wrong aggressivity level"))
  })
}
