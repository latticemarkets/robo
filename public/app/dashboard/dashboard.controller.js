/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 29/01/2016
*/

(() => {
    'use strict';

    class DashboardController {
        constructor(cssInjector, authenticationService, $location) {
            var vm = this;
            cssInjector.add("assets/stylesheets/homer_style.css");

            vm.logout = () => {
                authenticationService.logout();
                $location.path('/');
            };
        }
    }

    angular
        .module('app')
        .controller('DashboardController', DashboardController);
})();