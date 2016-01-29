/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 27/01/2016
*/

(function() {
    'use strict';

    class SignupRegisteredController {
        constructor($timeout, $location) {
            const vm = this;

            $timeout(() => $location.path('/dashboard'), 5000);
        }
    }

    angular
        .module('app')
        .controller('SignupRegisteredController', SignupRegisteredController);
})();