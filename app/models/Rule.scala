/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package models

import de.sciss.play.json.AutoFormat

/**
 * @author : julienderay
 * Created on 14/02/2016
 */

sealed trait RuleParams
case class InSetParams(set: Set[String]) extends RuleParams
case class InRangeParams(from: BigDecimal, to: BigDecimal) extends RuleParams

object RuleParams {
  implicit val paramsFormat = AutoFormat[RuleParams]
}

object RuleType extends Enumeration {
  type RuleType = Value
  val InSet, InRange = Value

  def isRuleTypeType(s: String) = values.exists(_.toString == s)
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

object RuleName extends Enumeration {
  val newAccounts = Value("newAccounts")
  val totalCreditLines = Value("totalCreditLines")
  val creditScore = Value("creditScore")
  val maxDelinquencies = Value("maxDelinquencies")
  val earliestCreditLine = Value("earliestCreditLine")
  val employmentLength = Value("employmentLength")
  val jobTitle = Value("jobTitle")
  val homeOwnership = Value("homeOwnership")
  val inquiries = Value("inquiries")
  val loanPaymentIncome = Value("loanPaymentIncome")
  val verifiedIncome = Value("verifiedIncome")
  val loanAmount = Value("loanAmount")
  val maxDebtIncome = Value("maxDebtIncome")
  val maxDebtIncomeWithLoan = Value("maxDebtIncomeWithLoan")
  val monthlyIncome = Value("monthlyIncome")
  val lastDelinquency = Value("lastDelinquency")
  val lastRecord = Value("lastRecord")
  val openCreditLine = Value("openCreditLine")
  val publicRecords = Value("publicRecords")
  val loanPurpose = Value("loanPurpose")
  val revolvingItilization = Value("revolvingItilization")
  val expectedReturn = Value("expectedReturn")
  val highestExpectedReturn = Value("highestExpectedReturn")
  val state = Value("state")
  val subGrade = Value("subGrade")
  val term = Value("term")
  val loanPopularity = Value("loanPopularity")
}

object RuleRepresentation extends Enumeration {
  val slider = Value("slider")
  val rangeSlider = Value("rangeSlider")
  val multiSelect = Value("multiSelect")
  val estimation = Value("estimation")
  val text = Value("text")
}
