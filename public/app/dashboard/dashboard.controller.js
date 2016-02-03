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
        constructor(cssInjector, authenticationService, $location, dashboardDataService, userService) {
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
                dashboardDataService.averageMaturity(response => vm.averageMaturity = moment(response.data.averageMaturity).fromNow());
                dashboardDataService.averageIntRate(response => vm.averageIntRate = response.data.averageIntRate);
                dashboardDataService.expectedReturns(response => vm.expectedReturns = response.data.expectedReturns);
                dashboardDataService.lastLoanMaturity(response => vm.lastLoanMaturity = moment(response.data.lastLoanMaturity).fromNow());
                userService.userData(authenticationService.getCurrentUsersEmail(), response => vm.username = `${response.data.firstName} ${response.data.lastName}`);
                dashboardDataService.currentRoiRate(response => vm.currentRoiRate = response.data.currentRoiRate);
                dashboardDataService.expectedRoiRate(response => vm.expectedRoiRate = response.data.expectedRoiRate);
            }

            const originator1 = [
                {maturityDate: '02/02/2016', intRate: 0.12},
                {maturityDate: '05/03/2016', intRate: 0.08},
                {maturityDate: '10/02/2016', intRate: 0.02},
                {maturityDate: '20/04/2016', intRate: 0.10},
                {maturityDate: '21/06/2016', intRate: 0.12},
                {maturityDate: '21/06/2016', intRate: 0.14},
                {maturityDate: '28/07/2016', intRate: 0.20},
                {maturityDate: '04/09/2016', intRate: 0.06},
                {maturityDate: '11/12/2016', intRate: 0.04}
            ];

            const originator2 = [
                {maturityDate: '01/03/2016', intRate: 0.08},
                {maturityDate: '07/03/2016', intRate: 0.09},
                {maturityDate: '18/04/2016', intRate: 0.04},
                {maturityDate: '14/07/2016', intRate: 0.05},
                {maturityDate: '27/09/2016', intRate: 0.19},
                {maturityDate: '06/10/2016', intRate: 0.07},
                {maturityDate: '10/11/2016', intRate: 0.13},
                {maturityDate: '20/12/2016', intRate: 0.04},
                {maturityDate: '23/12/2016', intRate: 0.06}
            ];

            vm.loansMaturity = [
                { name: "originator1", data: originator1},
                { name: "originator2", data: originator2}
            ];
        }
    }

    angular
        .module('app')
        .controller('DashboardController', DashboardController);
})();