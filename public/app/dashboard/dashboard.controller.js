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
        constructor(cssInjector, authenticationService, $location, dashboardDataService, userService, loansAcquiredService) {
            var vm = this;
            cssInjector.add("assets/stylesheets/homer_style.css");

            initData();

            vm.logout = () => {
                authenticationService.logout();
                $location.path('/');
            };

            function initData() {
                dashboardDataService.availableCapital(response => vm.availableCapital = response.data.availableCapital);
                dashboardDataService.allocatedCapital(response => vm.allocatedCapital = response.data.allocatedCapital);
                vm.lastUpdate = new Date();
                dashboardDataService.averageMaturity(response => vm.averageMaturity = moment(response.data.averageMaturity).fromNow(true));
                dashboardDataService.averageIntRate(response => vm.averageIntRate = response.data.averageIntRate);
                dashboardDataService.expectedReturns(response => vm.expectedReturns = response.data.expectedReturns);
                dashboardDataService.lastLoanMaturity(response => vm.lastLoanMaturity = moment(response.data.lastLoanMaturity).fromNow());
                userService.userData(authenticationService.getCurrentUsersEmail(), response => vm.username = `${response.data.firstName} ${response.data.lastName}`);
                dashboardDataService.currentRoiRate(response => vm.currentRoiRate = response.data.currentRoiRate);
                dashboardDataService.expectedRoiRate(response => vm.expectedRoiRate = response.data.expectedRoiRate);
                vm.loansMaturityPromise = dashboardDataService.currentLoansPromise();
                dashboardDataService.loansAcquiredPerDayLastWeek(response => {
                    vm.loansAcquiredPerDay = loansAcquiredService.prepareData(response.data);
                    vm.loansAcquiredLastWeek = response.data.reduce((last, loans) => loans + last, 0);
                });
                vm.platformAllocationPromise = dashboardDataService.platformAllocationPromise();
                vm.riskDiversificationPromise = dashboardDataService.riskDiversificationPromise();
            }

            vm.loansAcquiredPerDayOption = loansAcquiredService.barChartOptions;
        }
    }

    angular
        .module('app')
        .controller('DashboardController', DashboardController);
})();