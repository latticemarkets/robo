package com.pdx.originator.lendingclub

import java.io.File
import java.io.FileOutputStream
import java.io.PrintWriter
import java.time.Duration
import java.time.LocalTime
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.concurrent.Executors
import java.util.zip.GZIPOutputStream

import scala.util.control.NonFatal

import scalaj.http.Http

/**
 * @author ze97286
 */
object LendingClubSampler {
  private val scheduler = Executors.newSingleThreadExecutor
  private val file = new File("/tmp/LC.txt.gz");

  if (!file.exists) {
    file.createNewFile()
  }

  private val out = new GZIPOutputStream(new FileOutputStream(file), false)
  private val pw = new PrintWriter(out)

  private val TwoAm = LocalTime.of(2, 0)
  private val SixAm = LocalTime.of(6, 0)
  private val TenAm = LocalTime.of(10, 0)
  private val TwoPm = LocalTime.of(14, 0)
  private val MarketHours = Seq(TwoAm, SixAm, TenAm, TwoPm)

  private val EndOfDay = LocalTime.of(23, 59, 59, 999999999)
  private val LastOpenToEndOfDayInSeconds = Duration.between(MarketHours.last, EndOfDay).getSeconds + 1

  private val BeforeMarketOpenThreasholdInSeconds = 15
  private val AfterMarketOpenThresholdsInSeconds = Seq(2 * 60, 10 * 60, 30 * 60, 60 * 60) zipWithIndex
  private val DelaysInSeconds = Seq(0, 5, 60, 300, 600)

  val LoanListingUrl = "https://api.lendingclub.com/api/investor/v1/loans/listing?showAll=false"
  val ApiKey = "dRnUdkJT1ZWTJk0+FZkxBaUl3gY="

  private def findNearestPastMarketHour(lt: LocalTime): Option[LocalTime] = {
    MarketHours.filter(!_.isAfter(lt)).lastOption
  }

  private def findNearestFutureMarketHour(lt: LocalTime): Option[LocalTime] = {
    MarketHours.filter(!_.isBefore(lt)).headOption
  }

  private def timeSinceLastMarketOpenInSeconds(lt: LocalTime) = findNearestPastMarketHour(lt) map (x => Duration.between(x, lt).getSeconds) getOrElse (lt.toSecondOfDay + LastOpenToEndOfDayInSeconds)
  private def timeTillNextMarketOpenInSeconds(lt: LocalTime) = findNearestFutureMarketHour(lt) map (x => Duration.between(lt, x).getSeconds) getOrElse (Duration.between(lt, EndOfDay).getSeconds + 1 + MarketHours.head.toSecondOfDay)

  private def findDelay(lt: LocalTime): Long = {
    val timeSinceLastMOInSeconds = timeSinceLastMarketOpenInSeconds(lt)
    val timeTillNextMOInSeconds = timeTillNextMarketOpenInSeconds(lt)

    if (timeTillNextMOInSeconds <= BeforeMarketOpenThreasholdInSeconds) {
      0
    } else {
      Math.min(timeTillNextMOInSeconds - BeforeMarketOpenThreasholdInSeconds, AfterMarketOpenThresholdsInSeconds.filter { case (x, i) => x > timeSinceLastMOInSeconds }.headOption.map(x => DelaysInSeconds(x._2)).getOrElse(DelaysInSeconds.last)).toInt
    }
  }

  private def writeToFile(lt: LocalTime, loans: String) {
    try {
      pw.println(s"$lt => $loans")
    } catch {
      case NonFatal(e) => e.printStackTrace
    } finally {
      pw.flush
    }
  }

  private val task = new Runnable {
    override def run {
      val pacificTime = ZonedDateTime.now.withZoneSameInstant(ZoneId.of("America/Los_Angeles")).toLocalTime
      println(s"pacific time is: $pacificTime")
      val loans = LendingClubConnectionImpl.availableLoans
      writeToFile(pacificTime, loans.toString)
      println("finished")
      val delay = findDelay(pacificTime)
      if (delay > 0) {
        println(s"going to sleep for $delay seconds")
        Thread.sleep(delay * 1000l)
      }
      scheduler.submit(this)
    }
  }

  private def availableLoans: String = {
    Http(LoanListingUrl)
      .headers((LendingClubConfig.AuthorisationHeader, ApiKey)).asString.body
  }

  private def main(args: Array[String]): Unit = {
    sys.ShutdownHookThread {
      println("exiting")
      pw.close
      out.close
    }

    val future = scheduler.submit(task)
    future.get
  }
}