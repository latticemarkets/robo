/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package models

import javax.inject.Inject
import javax.inject.Singleton

import core.DbUtil
import models.OriginatorEnum.OriginatorEnum
import play.api.libs.json.{JsObject, Json}
import reactivemongo.play.json.collection.JSONCollection
import play.modules.reactivemongo.json._
import scala.concurrent.ExecutionContext.Implicits.global

import core.Formatters._

/**
  * @author : julienderay
  * Created on 25/02/2016
  */

case class AutomatedStrategySimulationModel(
                                        _id: String,
                                        originator: String,
                                        steps: Seq[SimulationStep]
                                      ) {
  def originatorEnum: OriginatorEnum = OriginatorEnum.withName(originator)
}

case class SimulationStep(
                           strategyReturns: Seq[StrategyReturns],
                           min95: BigDecimal,
                           max95: BigDecimal,
                           median: BigDecimal,
                           portfolioComposition: PortfolioComposition
                          )

case class PortfolioComposition(
                                gradeRatioA: BigDecimal,
                                gradeRatioB: BigDecimal,
                                gradeRatioC: BigDecimal,
                                gradeRatioD: BigDecimal,
                                gradeRatioE: BigDecimal,
                                gradeRatioF: BigDecimal,
                                gradeRatioG: BigDecimal
                                )

case class StrategyReturns(
                          expectedReturn: BigDecimal,
                          quantity: BigDecimal
                          )

@Singleton class AutomatedStrategySimulation @Inject() (dbUtil: DbUtil) {
  val collectionName = "automatedStrategySimulation"

  val automatedStrategySimulationTable: JSONCollection = dbUtil.db.collection(collectionName)

  def store(automatedStrategySimulation: AutomatedStrategySimulationModel) = {
    for {
      result <- automatedStrategySimulationTable.insert(Json.toJson(automatedStrategySimulation).as[JsObject])
      newAutomatedStrategySimulation <- findByEmail(automatedStrategySimulation._id) if result.ok
    } yield newAutomatedStrategySimulation
  }

  def findByEmail(email: String) = automatedStrategySimulationTable.find(Json.obj("_id" -> email)).one[AutomatedStrategySimulationModel]
}

