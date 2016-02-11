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

    class RulesController {
        constructor($routeParams, constantsService, $location, cssInjector) {
            var vm = this;
            cssInjector.add("assets/stylesheets/homer_style.css");

            const platform = $routeParams.platform;

            if (!constantsService.platforms().some(realPlatform => realPlatform == platform)) {
                $location.path('/strategies');
            }

            // Mock
            //userService.userData(authenticationService.getCurrentUsersEmail(), response => vm.rules = response.data.platforms[platform]);
            vm.rules = [
                {
                    name: 'aggressive rule',
                    expectedReturn: {
                        value: 1200,
                        percent: 0.13,
                        margin: 0.04
                    },
                    loansAvailablePerWeek: 4390,
                    moneyAvailablePerWeek: 149800,
                    criteria: [
                        {
                            name: 'Expected Return'
                        }
                    ]
                },
                {
                    name: 'naive rule',
                    expectedReturn: {
                        value: 800,
                        percent: 0.04,
                        margin: 0.06
                    },
                    loansAvailablePerWeek: 780,
                    moneyAvailablePerWeek: 4590,
                    criteria: [
                        {
                            name: 'Max. Debt / Income'
                        }
                    ]
                }
            ];
            // ----


        }
    }

    angular
        .module('app')
        .controller('RulesController', RulesController);
})();