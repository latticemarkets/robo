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

    class StrategiesController {
        constructor(cssInjector, userService, authenticationService, constantsService, $filter) {
            var vm = this;

            cssInjector.add("assets/stylesheets/homer_style.css");

            // Mock
            //userService.userData(authenticationService.getCurrentUsersEmail(), response => vm.platforms = response.data.platforms);
            vm.platforms = [
                {
                    name: 'ratesetter',
                    apiKey: 'fkldjf-dgfsfgsgq-fdssdf-fsgsfg',
                    accountId: '7867469834093',
                    strategy: 'aggressive',
                    rules: [
                        {
                            name: 'aggressive rule #1',
                            expectedReturn: 1200
                        },
                        {
                            name: 'aggressive rule #2',
                            expectedReturn: 4800
                        }
                    ]
                },
                {
                    name: 'fundingCircle',
                    apiKey: 'kjdhfsg-gfdgdsfg-sfqgfsg-sgfgfsg',
                    accountId: '86897638974637',
                    strategy: 'moderate',
                    rules: [
                        {
                            name: 'moderate rule #1',
                            expectedReturn: 3400
                        },
                        {
                            name: 'moderate rule #2',
                            expectedReturn: 1600
                        }
                    ]
                }
            ];
            // ----

            vm.platformsImgExtensions = constantsService.platformsImgExtensions;

            vm.totalExpected = platform => platform.rules.reduce((prev, rule) => rule.expectedReturn + prev, 0);
            vm.fromCamelCaseToTitle = str => $filter('titlecase')($filter('camelCaseToHuman')(str));
        }
    }

    angular
        .module('app')
        .controller('StrategiesController', StrategiesController);
})();