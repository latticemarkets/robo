/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers.automatedStrategySimulation

import controllers.Security.HasToken
import models.{PortfolioComposition, SimulationStep, StrategyReturns, AutomatedStrategySimulation}
import play.api.libs.json.Json
import play.api.mvc.Controller

import core.Formatters._

/**
  * @author : julienderay
  * Created on 25/02/2016
  */

class AutomatedStrategySimulations extends Controller {

  def getSimulation(email: String, originator: String) = HasToken {
    val r = scala.util.Random
    val strategyReturns = Seq[StrategyReturns](
      StrategyReturns(-7, 0),
      StrategyReturns(-5, 0.3),
      StrategyReturns(-2.5, 1.2),
      StrategyReturns(0, 2.3),
      StrategyReturns(2.5, 3.85),
      StrategyReturns(5, 7.5),
      StrategyReturns(8, 10),
      StrategyReturns(13, 1),
      StrategyReturns(13.5, 0))

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
