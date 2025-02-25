name := """robo"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  specs2 % Test
)

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"
resolvers += "Kaliber Repository" at "https://jars.kaliber.io/artifactory/libs-release-local"

routesGenerator := InjectedRoutesGenerator

libraryDependencies ++= Seq(
  "org.reactivemongo" %% "play2-reactivemongo" % "0.11.10",
  "org.mindrot" % "jbcrypt" % "0.3m",
  "org.scalaj" %% "scalaj-http" % "2.2.1",
  "org.scalanlp" %% "breeze" % "0.12",
  "org.scalanlp" %% "breeze-natives" % "0.12",
  "org.scalanlp" %% "breeze-viz" % "0.12",
  "de.sciss" %% "play-json-sealed" % "0.2.0",
  "com.typesafe.play" %% "play-mailer" % "4.0.0"
)
