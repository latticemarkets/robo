/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.automatedStrategySimulation

import breeze.stats.distributions.Gaussian
import controllers.Security.HasToken
import core.Formatters._
import models.{AutomatedStrategySimulation, PortfolioComposition, SimulationStep, StrategyReturns}
import play.api.libs.json.Json
import play.api.mvc.Controller

/**
  * @author : julienderay
  * Created on 25/02/2016
  */

class AutomatedStrategySimulations extends Controller {

  def getSimulation(email: String, originator: String) = HasToken {
    val r = scala.util.Random

    val gau = Gaussian(3.0, 1.0)
    val y = List.tabulate(40)(n => 0.3 * n - 3)

    val strategyReturns = y
      .map( d => gau.logPdf(d))
      .map(v => {
        StrategyReturns(v + 3)
      })
      .toSeq

    def generateRandomPortfolioComposition = {
      var rest = 100

      val grades = for (i <- 1 to 7) yield {
        val gradeValue = r.nextInt(rest)
        rest = rest - gradeValue
        gradeValue
      }

      PortfolioComposition(grades(0), grades(1), grades(2), grades(3), grades(4), grades(5), grades(6))
    }

    Ok(Json.toJson(AutomatedStrategySimulation(
      email,
      originator,
      for (i <- 1 to 101) yield SimulationStep(
        strategyReturns,
        i * (-0.045/100) - 0.075,
        i * (0.0765/100) + 0.11,
        i * (0.022/100) + 0.063,
        generateRandomPortfolioComposition
      )
    )))
  }
}
