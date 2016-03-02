/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 02/03/2016
*/


(() => {
    'use strict';

    angular
        .module('app')
        .filter('capitalizeFirstLetter', ['$filter', $filter => (str) => str.charAt(0).toUpperCase() + str.slice(1)]);
})();