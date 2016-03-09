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

    sidebar.$inject = ['authenticationService', '$window', 'dashboardDataService','$location', 'infosCacheService'];

    function sidebar(authenticationService, $window, dashboardDataService, $location, infosCacheService) {
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

                // todo : cache these results
                infosCacheService.getUsername(username => scope.username = username);
                infosCacheService.getNumberOfPlatforms(nbPlatforms => scope.platforms = nbPlatforms);

                dashboardDataService.expectedReturns(response => scope.expectedReturns = response.data.expectedReturns);
            }
        };
    }
})();
