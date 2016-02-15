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

<<<<<<< HEAD
=======
abstract class CriterionType {
    def typeKey: String
    def typeName: String
    def representation: String
}

case class CriterionRangeConstraint(
                            val typeKey: String,
                            val typeName: String,
                            val representation: String,
                            val min: Int,
                            val max: Int) extends CriterionType

object Criteria {

  val criteriaTypes = Seq(
    CriterionRangeConstraint(CriterionName.newAccounts.toString, "New Accounts (24 months)", CriterionRepresentation.slider.toString, 0, 10)
//    CriterionType(CriterionName.totalCreditLines.toString, "Total Credit Lines", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.creditScore.toString, "Credit Score", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.delinquencies.toString, "Max. Delinquencies", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.earliestCreditLine.toString, "Earliest Credit Line", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.employmentLength.toString, "Employment Length", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.jobTitle.toString, "Job Title", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.homeOwnership.toString, "Home Ownership", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.inquiries.toString, "Inquiries", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.loanPaymentIncome.toString, "Loan Payment / Income", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.verifiedIncome.toString, "Verified Income", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.loanAmount.toString, "Loan Amount", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.maxDebtIncome.toString, "Max. Debt / Income", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.maxDebtIncomeWithLoan.toString, "Max. Debt / Income with Loan", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.monthlyIncome.toString, "Monthly Income", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.lastDelinquency.toString, "Last Delinquency", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.lastRecord.toString, "Last Record", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.openCreditLine.toString, "Open Credit Lines", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.publicRecords.toString, "Public Records", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.loanPurpose.toString, "Loan Purpose", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.revolvingItilization.toString, "Revolving Utilization", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.expectedReturn.toString, "Expected Return", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.highestExpectedReturn.toString, "Highest Expected Return", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.state.toString, "State", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.subGrade.toString, "Sub-Grade", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.term.toString, "Term", CriterionRepresentation.slider.toString),
//    CriterionType(CriterionName.loanPopularity.toString, "Loan Popularity", CriterionRepresentation.slider.toString)
  )
}

>>>>>>> fixes typo
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