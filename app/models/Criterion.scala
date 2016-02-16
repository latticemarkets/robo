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
  * Created on 14/02/2016
  */

case class Criterion(
                      id: String,
                      value: String,
                      typeKey: String
                    )

object CriterionName extends Enumeration {
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

object CriterionRepresentation extends Enumeration {
  val slider = Value("slider")
  val rangeSlider = Value("rangeSlider")
  val multiSelect = Value("multiSelect")
  val estimation = Value("estimation")
  val text = Value("text")
}
