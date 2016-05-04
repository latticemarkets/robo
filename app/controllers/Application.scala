package controllers

import com.google.inject.Inject
import play.api.mvc._

class Application @Inject() () extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

  def dashboard = Action {
    Ok(views.html.dashboard())
  }
}
