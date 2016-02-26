/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 26/02/2016
*/

(() => {
    'use strict';

    function c3Factory($window) {
        if (!$window._) {}
        return $window.c3;
    }

    c3Factory.$inject = ['$window'];

    angular
        .module('app')
        .factory('c3', c3Factory);
})();