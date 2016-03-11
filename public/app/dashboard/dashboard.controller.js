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
        constructor(dashboardDataService, $scope, $timeout, dashboardGuidedTourService, $cookies, infosCacheService) {
            var vm = this;

            initData();

            function initData() {
                  vm.portfolioMetricsPromise = dashboardDataService.portfolioMetrics(response => {
                  vm.availableCapital = response.data.availableCapital;
                  vm.allocatedCapital = response.data.allocatedCapital;
                  vm.lastUpdate = new Date();
                  vm.averageIntRate = response.data.averageIntRate;
                  vm.currentRoiRate = response.data.currentRoiRate;
                  vm.expectedRoiRate = response.data.expectedRoiRate;
                  vm.loansAcquiredLastWeek = response.data.loansAcquiredPerDayLastWeek.reduce((last, loans) => loans + last, 0);
                });
            }

            if ($cookies.get('guidedTour')) {
                dashboardGuidedTourService.init();

                $timeout(() => {
                    dashboardGuidedTourService.start();
                }, 1000);

                $scope.$on('$destroy', function() {
                    dashboardGuidedTourService.end();
                });

                $cookies.remove('guidedTour');
            }
        }
    }

    angular
        .module('app')
        .controller('DashboardController', DashboardController);
})();
