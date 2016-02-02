package com.pdx.originator.lendingclub

import java.time.Duration
import java.time.LocalTime
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.concurrent.Executors
import scalaj.http.Http

/**
 * @author ze97286
 */
object LendingClubSampler {
  val scheduler = Executors.newSingleThreadExecutor

  val TwoAm = LocalTime.of(2, 0)
  val SixAm = LocalTime.of(6, 0)
  val TenAm = LocalTime.of(10, 0)
  val TwoPm = LocalTime.of(14, 0)
  val MarketHours = Seq(TwoAm, SixAm, TenAm, TwoPm)

  val EndOfDay = LocalTime.of(23, 59, 59, 999999999)
  val LastOpenToEndOfDayInSeconds = Duration.between(MarketHours.last, EndOfDay).getSeconds + 1

  val BeforeMarketOpenThreasholdInSeconds = 15
  val AfterMarketOpenThresholdsInSeconds = Seq(2 * 60, 10 * 60, 30 * 60, 60 * 60) zipWithIndex
  val DelaysInSeconds = Seq(0, 5, 60, 300, 600)

  def findNearestPastMarketHour(lt: LocalTime): Option[LocalTime] = {
    MarketHours.filter(!_.isAfter(lt)).lastOption
  }

  def findNearestFutureMarketHour(lt: LocalTime): Option[LocalTime] = {
    MarketHours.filter(!_.isBefore(lt)).headOption
  }

  def timeSinceLastMarketOpenInSeconds(lt: LocalTime) = findNearestPastMarketHour(lt) map (x => Duration.between(x, lt).getSeconds) getOrElse (lt.toSecondOfDay + LastOpenToEndOfDayInSeconds)
  def timeTillNextMarketOpenInSeconds(lt: LocalTime) = findNearestFutureMarketHour(lt) map (x => Duration.between(lt, x).getSeconds) getOrElse (Duration.between(lt, EndOfDay).getSeconds + 1 + MarketHours.head.toSecondOfDay)

  def findDelay(lt: LocalTime): Long = {
    val timeSinceLastMOInSeconds = timeSinceLastMarketOpenInSeconds(lt)
    val timeTillNextMOInSeconds = timeTillNextMarketOpenInSeconds(lt)

    if (timeTillNextMOInSeconds <= BeforeMarketOpenThreasholdInSeconds) {
      0
    } else {
      Math.min(timeTillNextMOInSeconds - BeforeMarketOpenThreasholdInSeconds, AfterMarketOpenThresholdsInSeconds.filter { case (x, i) => x > timeSinceLastMOInSeconds }.headOption.map(x => DelaysInSeconds(x._2)).getOrElse(DelaysInSeconds.last)).toInt
    }
  }

  val task = new Runnable {
    override def run {
    	val pacificTime = ZonedDateTime.now.withZoneSameInstant(ZoneId.of("America/Los_Angeles")).toLocalTime
      println(s"pacific time is: $pacificTime")
      val loans=LendingClubConnectionImpl.availableLoans
      
      val delay = findDelay(pacificTime)
      if (delay > 0) {
        println(s"going to sleep for $delay seconds")
        Thread.sleep(delay*1000l)
      }
      scheduler.submit(this)
    }
  }
  
  val LoanListingUrl = "https://api.lendingclub.com/api/investor/v1/loans/listing?showAll=false"
  val ApiKey = "dRnUdkJT1ZWTJk0+FZkxBaUl3gY="
  
  def availableLoans: String = {
    Http(LoanListingUrl)
      .headers((LendingClubConfig.ApiKeyHeader, ApiKey)).asString.body
  }

  def main(args: Array[String]): Unit = {
    val future = scheduler.submit(task)
    future.get
  }
}