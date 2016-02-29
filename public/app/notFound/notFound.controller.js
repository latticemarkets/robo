/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 29/02/2016
*/

(() => {
    'use strict';

    class NotFoundController {
        constructor(authenticationService, $window, $location) {
            var vm = this;

            vm.userConnected = authenticationService.getCurrentUsersEmail() !== undefined;

            vm.goToLandpage = () => $window.location.href = '/';
            vm.goToDashboard = () => {
                if (vm.userConnected) $location.path('/dashboard');
            };
        }
    }

    angular
        .module('app')
        .controller('NotFoundController', NotFoundController);
})();