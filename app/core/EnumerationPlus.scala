/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package core

/**
  * @author : julienderay
  * Created on 16/03/2016
  */

class EnumerationPlus extends Enumeration {
  def isThisType(s: String) = values.exists(_.toString == s)
}
