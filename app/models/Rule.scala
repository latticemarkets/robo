/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package models

import core.EnumerationPlus
import de.sciss.play.json.AutoFormat

/**
 * @author : julienderay
 * Created on 14/02/2016
 */

sealed trait RuleParams
case class InSetParams(set: Set[String]) extends RuleParams
case class InRangeParams(from: BigDecimal, to: BigDecimal) extends RuleParams

object RuleParams extends EnumerationPlus {
  implicit val paramsFormat = AutoFormat[RuleParams]
}

object RuleType extends EnumerationPlus {
  type RuleType = Value
  val InSet, InRange = Value
}

object Rule {
  def apply(attribute: String,
                     ruleType: String,
                     ruleParams: String):Rule = {
    val params=if (ruleType==RuleType.InSet.toString) {
      InSetParams(ruleParams.split(",").map(_.trim).toSet)
    } else if  (ruleType==RuleType.InRange.toString()) {
      val p=ruleParams.split(",").map(_.trim)
      InRangeParams(BigDecimal(p(0)),BigDecimal(p(1)))
    }
    else {
      throw new IllegalArgumentException
    }
    new Rule(attribute,ruleType,params)
  }

  def unapply(r:Rule):Option[(String,String,String)]={
    val params=if (r.ruleType==RuleType.InSet.toString()) {
      r.ruleParams.asInstanceOf[InSetParams].set mkString ","
    }
    else if (r.ruleType==RuleType.InRange.toString()) {
      r.ruleParams.asInstanceOf[InRangeParams].from+","+r.ruleParams.asInstanceOf[InRangeParams].to
    }
    else {
      throw new IllegalArgumentException
    }
    Some((r.attribute,r.ruleType,params))
  }
}
 class Rule(val attribute: String,
                      val ruleType: String,
                      val ruleParams: RuleParams) {
  def ruleTypeEnum=RuleType.withName(ruleType)


}

object RuleName extends EnumerationPlus {
  val newAccounts,
      totalCreditLines,
      creditScore,
      maxDelinquencies,
      earliestCreditLine,
      employmentLength,
      jobTitle,
      homeOwnership,
      inquiries,
      loanPaymentIncome,
      verifiedIncome,
      loanAmount,
      maxDebtIncome,
      maxDebtIncomeWithLoan,
      monthlyIncome,
      lastDelinquency,
      lastRecord,
      openCreditLine,
      publicRecords,
      loanPurpose,
      revolvingUtilization,
      expectedReturn,
      highestExpectedReturn,
      state,
      subGrade,
      term,
      loanPopularity = Value
}