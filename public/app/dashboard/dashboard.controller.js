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
        constructor($scope, $timeout, dashboardGuidedTourService, $cookies, infosCacheService) {
            var vm = this;

            initData();

            function initData() {
                infosCacheService.getAvailableCapital(availableCapital => vm.availableCapital = availableCapital);
                infosCacheService.getAllocatedCapital(allocatedCapital => vm.allocatedCapital = allocatedCapital);
                infosCacheService.getAverageIntRate(averageIntRate => vm.averageIntRate = averageIntRate);
                infosCacheService.getCurrentRoiRate(currentRoiRate => vm.currentRoiRate = currentRoiRate);
                infosCacheService.getExpectedRoiRate(expectedRoiRate => vm.expectedRoiRate = expectedRoiRate);
                infosCacheService.getLoansAcquiredPerDayLastWeek(loansAcquiredPerDayLastWeek => vm.loansAcquiredPerDayLastWeek = loansAcquiredPerDayLastWeek);
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
