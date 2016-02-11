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
        constructor(cssInjector, dashboardDataService, flotChartService) {
            var vm = this;
            cssInjector.add("assets/stylesheets/homer_style.css");

            initData();

            function initData() {
                dashboardDataService.availableCapital(response => vm.availableCapital = response.data.availableCapital);
                dashboardDataService.allocatedCapital(response => vm.allocatedCapital = response.data.allocatedCapital);
                vm.lastUpdate = new Date();
                dashboardDataService.averageMaturity(response => vm.averageMaturity = moment(response.data.averageMaturity).fromNow(true));
                dashboardDataService.averageIntRate(response => vm.averageIntRate = response.data.averageIntRate);
                dashboardDataService.currentRoiRate(response => vm.currentRoiRate = response.data.currentRoiRate);
                dashboardDataService.expectedRoiRate(response => vm.expectedRoiRate = response.data.expectedRoiRate);
                vm.loansMaturityPromise = dashboardDataService.currentLoansPromise();
                vm.loansAcquiredPerDayPromise = dashboardDataService.loansAcquiredPerDayLastWeek(response => {
                    vm.loansAcquiredLastWeek = response.data.reduce((last, loans) => loans + last, 0);
                });
                vm.platformAllocationPromise = dashboardDataService.platformAllocationPromise();
                vm.riskDiversificationPromise = dashboardDataService.riskDiversificationPromise();
            }

            vm.loansAcquiredPerDayOption = flotChartService.barChartOptions;
        }
    }

    angular
        .module('app')
        .controller('DashboardController', DashboardController);
})();