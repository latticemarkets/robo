/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.portfolioMetrics

import java.time.LocalDate
import javax.inject.Inject

import controllers.Security
import play.api.libs.json.Json
import play.api.mvc.Controller

/**
  * @author : julienderay
  * Created on 22/02/2016
  */

class PortfolioMetrics @Inject() (security: Security) extends Controller {
  def portfolioMetrics() = security.HasToken {
    val loans = Json.arr(
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-02-02", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-02-02", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-03-05", "intRate" -> 0.08),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-02-10", "intRate" -> 0.02),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-04-20", "intRate" -> 0.10),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-06-21", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-06-21", "intRate" -> 0.14),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-07-28", "intRate" -> 0.20),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-09-04", "intRate" -> 0.06),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-11-02", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2016-12-02", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-03-05", "intRate" -> 0.08),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-03-10", "intRate" -> 0.02),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-03-20", "intRate" -> 0.10),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-04-21", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-06-21", "intRate" -> 0.14),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-10-28", "intRate" -> 0.20),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-10-04", "intRate" -> 0.06),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-11-02", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-12-02", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-12-05", "intRate" -> 0.08),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2017-12-10", "intRate" -> 0.02),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2018-02-20", "intRate" -> 0.10),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2018-03-21", "intRate" -> 0.12),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2018-05-21", "intRate" -> 0.14),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2018-05-28", "intRate" -> 0.20),
      Json.obj("originator" -> "lendingClub", "maturityDate" -> "2018-07-04", "intRate" -> 0.06),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-12-11", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-03-01", "intRate" -> 0.08),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-03-07", "intRate" -> 0.09),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-04-18", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-07-14", "intRate" -> 0.05),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-09-27", "intRate" -> 0.19),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-10-06", "intRate" -> 0.07),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-11-10", "intRate" -> 0.13),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-12-20", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2016-12-11", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-01-01", "intRate" -> 0.08),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-01-07", "intRate" -> 0.09),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-03-18", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-05-14", "intRate" -> 0.05),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-05-27", "intRate" -> 0.19),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-07-06", "intRate" -> 0.07),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-10-10", "intRate" -> 0.13),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-11-20", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-11-11", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-12-01", "intRate" -> 0.08),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2017-12-07", "intRate" -> 0.09),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-01-18", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-04-14", "intRate" -> 0.05),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-05-27", "intRate" -> 0.19),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-06-06", "intRate" -> 0.07),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-11-10", "intRate" -> 0.13),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-12-20", "intRate" -> 0.04),
      Json.obj("originator" -> "prosper", "maturityDate" -> "2018-12-23", "intRate" -> 0.0)
    )
    val loansAcquiredPerDayLastWeek = Json.arr(10, 26, 16, 36, 32, 51, 51)
    val platformAllocation = Json.arr(
      Json.obj("originator" -> "lendingClub", "loansAcquired" -> 245),
      Json.obj("originator" -> "prosper", "loansAcquired" -> 18),
      Json.obj("originator" -> "bondora", "loansAcquired" -> 59),
      Json.obj("originator" -> "ratesetter", "loansAcquired" -> 195),
      Json.obj("originator" -> "fundingCircle", "loansAcquired" -> 90)
    )
    val riskDiversification = Json.arr(
      Json.obj("grade" -> "A", "value" -> 240),
      Json.obj("grade" -> "B", "value" -> 49),
      Json.obj("grade" -> "C", "value" -> 189),
      Json.obj("grade" -> "D", "value" -> 140),
      Json.obj("grade" -> "E", "value" -> 200)
    )
    Ok(Json.obj("availableCapital" -> 200000,
                "allocatedCapital" -> 300000,
                "averageIntRate" -> 0.12,
                "lastLoanMaturity" -> LocalDate.parse("2018-01-07"),
                "currentRoiRate" -> 0.15,
                "expectedRoiRate" -> 0.12,
                "expectedReturns" -> 34000,
                "currentLoans" -> loans,
                "loansAcquiredPerDayLastWeek" -> loansAcquiredPerDayLastWeek,
                "platformAllocation" -> platformAllocation,
                "riskDiversification" -> riskDiversification))
  }
}
