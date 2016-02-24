package com.pdx.insurance

import java.io.File
import java.io.PrintWriter
import scala.BigDecimal
import scala.math.BigDecimal.double2bigDecimal
import scala.math.BigDecimal.int2bigDecimal

object Analyser {

  val LoansPerPortfolio = 200
  val SampleSize = 10000
  val NoteSize = 25d
  val OutputDir = "/Users/ze97286/Desktop/insruanceSampling/"
  val InputFile =  "/Users/ze97286/Desktop/input.csv"

  val Months = Seq("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
  val GradeToIndex = Map("A" -> 0, "B" -> 1, "C" -> 2, "D" -> 3, "E" -> 4, "F" -> 5, "G" -> 6)
  val DefaultStates = Set("Charged Off", "Default", "In Grace Period", "Late (16-30 days)", "Late (16-30 days)", "Late (31-120 days)")
  
  case class LCL(fundedAmount: BigDecimal,
                 issuedMonth: String,
                 term: Int,
                 intRate: Double,
                 installment: BigDecimal,
                 grade: String,
                 state: String,
                 outstandingPrincipal: BigDecimal,
                 totalPaid: BigDecimal,
                 paidPrincipal: BigDecimal,
                 paidInterest: BigDecimal,
                 lateFees: BigDecimal,
                 recoveries: BigDecimal,
                 recoveryFees: BigDecimal)

  def linesToLCL(lines: Seq[String]): Seq[LCL] = {
    lines map (line => {
      val fields = line.split(",")
      LCL(fundedAmount = BigDecimal(fields(0)),
        term = Integer.parseInt(fields(1).trim.split(" ").head),
        intRate = fields(2).dropRight(1).toDouble,
        installment = BigDecimal(fields(3)),
        grade = fields(4),
        issuedMonth = fields(5),
        state = fields(6),
        outstandingPrincipal = BigDecimal(fields(7)),
        totalPaid = BigDecimal(fields(8)),
        paidPrincipal = BigDecimal(fields(9)),
        paidInterest = BigDecimal(fields(10)),
        lateFees = BigDecimal(fields(11)),
        recoveries = BigDecimal(fields(12)),
        recoveryFees = BigDecimal(fields(13)))
    })
  }

  object Result {
    def headers: Seq[String] = Seq("breakevenCapitalInsuranceIR", "breakevenPrincipalInsuranceIR", "portfolioAverageIntRate", "avgIntRateAfterCapitalInsurance", "avgIntRateAfterPrincipalInsurance", "defaultedLoans", "investedInDefault", "defaultRate(%)", "receivedFromDefault", "principalReceivedFromDefault", "defaultCapitalDeficit", "defaultPrincipalDeficit", "totalExpectedInterest", "defaultCapitalDeficitToExpectedIRRatio(%)", "defaultPrincipalDeficitToExpectedIRRatio(%)")
  }

  case class Result(breakevenCapitalInsuranceIR: BigDecimal,
                    breakevenPrincipalInsuranceIR: BigDecimal,
                    portfolioAverageIntRate: BigDecimal,
                    defaultedLoans: BigDecimal,
                    investedInDefault: BigDecimal,
                    defaultRate: BigDecimal,
                    receivedFromDefault: BigDecimal,
                    principalReceivedFromDefault: BigDecimal,
                    defaultCapitalDeficit: BigDecimal,
                    defaultPrincipalDeficit: BigDecimal,
                    totalExpectedInterest: BigDecimal,
                    defaultCapitalDeficitToExpectedIRRatio: BigDecimal,
                    defaultPrincipalDeficitToExpectedIRRatio: BigDecimal) {
    val avgIntRateAfterCapitalInsurance = portfolioAverageIntRate - breakevenCapitalInsuranceIR
    val avgIntRateAfterPrincipalInsurance = portfolioAverageIntRate - breakevenPrincipalInsuranceIR

    override def toString = {
      s"$breakevenCapitalInsuranceIR, $breakevenPrincipalInsuranceIR, $portfolioAverageIntRate, $avgIntRateAfterCapitalInsurance,$avgIntRateAfterPrincipalInsurance,$defaultedLoans,  $investedInDefault, $defaultRate,$receivedFromDefault, $principalReceivedFromDefault, $defaultCapitalDeficit, $defaultPrincipalDeficit, $totalExpectedInterest, $defaultCapitalDeficitToExpectedIRRatio, $defaultPrincipalDeficitToExpectedIRRatio"
    }
  }

//  val issueDate = Months(month - 1) + "-" + year
  //month: Int, year: String, term: Int
  //(x => x.issuedMonth == issueDate && x.term == term)
  def select(loans:Seq[LCL],issuedFilter:LCL=>Boolean, term:Int, noLoans: Int, weights: Option[Array[Double]] = None): Result = {

    // filter only loans issued on the relevant month and with the given term
    val issuedLoans = loans.filter(issuedFilter(_))

    val selectedLoans = weights match {
      case None => util.Random.shuffle(util.Random.shuffle(util.Random.shuffle(issuedLoans))).take(noLoans).toArray
      case Some(w) => // split and shuffle the loans per grade
        val grades = issuedLoans groupBy (_.grade) map { case (g, l) => g -> util.Random.shuffle(util.Random.shuffle(util.Random.shuffle(l))) }
        grades.map { case (g, l) => l.take((w(GradeToIndex(g)) * noLoans.toDouble).toInt) }.flatten.toArray
    }

    // calculate the loss from charged off loans where we lost some of the principal
    val defaults = selectedLoans.filter(x => DefaultStates.contains(x.state))
    val totalInvestedInDefaulted = BigDecimal(defaults.size * NoteSize)
    val defaultRate = defaults.size / BigDecimal(selectedLoans.size) * 100d
    val receivedFromDefault = defaults map (x => x.totalPaid * NoteSize / x.fundedAmount) sum
    val principalReceivedFromDefault = defaults map (x => x.paidPrincipal * NoteSize / x.fundedAmount) sum

    val defaultCapitalDeficit = Math.max(0d, (totalInvestedInDefaulted - receivedFromDefault).doubleValue)
    val defaultPrincipalDeficit = Math.max(0d, (totalInvestedInDefaulted - principalReceivedFromDefault).doubleValue)

    // calculate the ratio between the default deficit and the total paid interest and multiply by the average interest rate
    // that is the yearly breakeven insurance
    val averageInterestRate = (selectedLoans map (_.intRate) sum) / selectedLoans.size.toDouble

    val myTotalInterest = selectedLoans.map(x => (x.installment * term - x.fundedAmount) * NoteSize / x.fundedAmount) sum
    val capitalInsuranceRate = 1.1 * (defaultCapitalDeficit / myTotalInterest) * averageInterestRate
    val principalInsuranceRate = 1.1 * (defaultPrincipalDeficit / myTotalInterest) * averageInterestRate

    Result(breakevenCapitalInsuranceIR = capitalInsuranceRate,
      breakevenPrincipalInsuranceIR = principalInsuranceRate,
      portfolioAverageIntRate = averageInterestRate,
      defaultedLoans = defaults.size,
      defaultRate = defaultRate,
      investedInDefault = totalInvestedInDefaulted,
      receivedFromDefault = receivedFromDefault,
      principalReceivedFromDefault = principalReceivedFromDefault,
      defaultCapitalDeficit = defaultCapitalDeficit,
      defaultPrincipalDeficit = defaultPrincipalDeficit,
      totalExpectedInterest = myTotalInterest,
      defaultCapitalDeficitToExpectedIRRatio = defaultCapitalDeficit / myTotalInterest,
      defaultPrincipalDeficitToExpectedIRRatio = defaultPrincipalDeficit / myTotalInterest)
  }

  def main(args: Array[String]): Unit = {
    //random
    experiment(OutputDir, s"Random${LoansPerPortfolio}Loans", SampleSize, LoansPerPortfolio, None)

    // all A
    experiment(OutputDir, s"AllA${LoansPerPortfolio}Loans", SampleSize, LoansPerPortfolio, Some(Array(1d, 0d, 0, 0, 0, 0, 0)))

    // conservative
    experiment(OutputDir, s"LRConservative{LoansPerPortfolio}Loans", SampleSize, LoansPerPortfolio, Some(Array(0.981d, 0.019d, 0, 0, 0, 0, 0)))

    // moderate
    experiment(OutputDir, s"LRModerate{LoansPerPortfolio}Loans", SampleSize, LoansPerPortfolio, Some(Array(0.01d, 0.52d, 0.08d, 0.238d, 0.118d, 0.031d, 0d)))

    // aggressive
    experiment(OutputDir, s"LRAggressive{LoansPerPortfolio}Loans", SampleSize, LoansPerPortfolio, Some(Array(0d, 0d, 0.17d, 0.507d, 0.251d, 0.066d, 0d)))
  }

  def experiment(prefix: String, suffix: String, samples: Int, noLoans: Int, weights: Option[Array[Double]]) {
    val name = s"$prefix$suffix"
    val loans = linesToLCL(scala.io.Source.fromFile(new File(InputFile)).getLines.toSeq.drop(1))
    
    val results = (0 until samples) map (x => select(loans, (x=> x.issuedMonth.endsWith("-12")), 36, noLoans, weights))
    println(s"*$suffix:*")

    // average interest rate for the portfolio across samples
    val (avgInt, stdInt) = avgAndStd(results, _.portfolioAverageIntRate)
    println(s"Average interest rate for the portfolio before insurance: $avgInt with std of $stdInt")

    // average cost of capital insurance
    val (avgCapitalInsruance, stdCapitalInsurance) = avgAndStd(results, _.breakevenCapitalInsuranceIR)
    println(s"Average capital insurance cost: $avgCapitalInsruance with std of $stdCapitalInsurance")

    // average capital risk free portfolio intrerest rate
    val (capitalRiskFreeIntRateAvg, capitalRiskFreeIntRateStd) = avgAndStd(results, _.avgIntRateAfterCapitalInsurance)
    println(s"Average capital risk free interest rate: $capitalRiskFreeIntRateAvg with std of $capitalRiskFreeIntRateStd")

    // average cost of principal insurance
    val (avgPrincipalInsruance, stdPrincipalInsruance) = avgAndStd(results, _.breakevenPrincipalInsuranceIR)
    println(s"Average principal insurance cost: $avgPrincipalInsruance with std of $stdPrincipalInsruance")

    // average principal risk free portfolio intrerest rate
    val (principalRiskFreeIntRateAvg, principalRiskFreeIntRateStd) = avgAndStd(results, _.avgIntRateAfterPrincipalInsurance)
    println(s"Average principal risk free interest rate: $principalRiskFreeIntRateAvg with std of $principalRiskFreeIntRateStd")
    writeToFile(name, results)
  }

  def avgAndStd(results: Seq[Result], f: Result => BigDecimal): (BigDecimal, BigDecimal) = {
    val avg = (results map (x => f(x)) sum) / results.size
    val std = stddev(results map (x => f(x)), avg).setScale(2, BigDecimal.RoundingMode.HALF_UP)
    (avg.setScale(2, BigDecimal.RoundingMode.HALF_UP), std)
  }

  def stddev(xs: Seq[BigDecimal], avg: BigDecimal): BigDecimal = xs match {
    case Nil => 0.0
    case ys => math.sqrt((0.0 /: ys) {
      (a, e) => a + math.pow((e - avg).doubleValue, 2.0)
    } / xs.size)
  }

  def writeToFile(name: String, arr: Seq[Result]) {
    val pw = new PrintWriter(s"${name}.csv")
    pw.println(Result.headers mkString ",")
    arr foreach (x => pw.println(x.toString))
    pw.close()
  }

}