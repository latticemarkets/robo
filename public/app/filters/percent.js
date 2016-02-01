/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 01/02/2016
*/

(() => {
    'use strict';

    angular
        .module('app')
        .filter('percent', ['$filter', $filter => (input, decimals) => $filter('number')(input * 100, decimals) + ' %']);
})();