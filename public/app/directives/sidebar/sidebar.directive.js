/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 11/02/2016
*/

(() => {
    'use strict';

    angular
        .module('app')
        .directive('sidebar', sidebar);

    sidebar.$inject = ['authenticationService', '$window', 'userService', 'dashboardDataService','$location'];

    function sidebar(authenticationService, $window, userService, dashboardDataService, $location) {
        return {
            replace: true,
            restrict: 'E',
            templateUrl: '/assets/app/directives/sidebar/sidebar.html',
            link(scope) {
                scope.logout = () => {
                    authenticationService.logout();
                    $window.location.href = '/';
                };

                scope.isActive = url => $location.path() === url;

                const email = authenticationService.getCurrentUsersEmail();

                // todo : cache these results
                userService.userData(email, response => scope.username = `${response.data.firstName} ${response.data.lastName}`);
                dashboardDataService.expectedReturns(response => scope.expectedReturns = response.data.expectedReturns);
                userService.userData(email, response => scope.platforms = response.data.platforms.length);
            }
        };
    }
})();
