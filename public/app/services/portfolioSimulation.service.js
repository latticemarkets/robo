/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 08/02/2016
*/

(() => {
    'use strict';

    class portfolioSimulationService {
        constructor() {

        }

        get portfolioKeysValues() {
            return {
                conservative: 'Conservative',
                moderateConservative: 'Moderately Conservative',
                moderate: 'Moderate',
                moderatelyAggressive: 'Moderately Aggressive',
                aggressive: 'Aggressive'
            };
        }

        simulatedDataFor(portfolio) {
            switch (portfolio) {
                case 'conservative':
                    return [10, 20, 40, 80, 160, 300];
                case 'moderateConservative':
                    return [10, 25, 50, 100, 200, 350];
                case 'moderate':
                    return [10, 30, 60, 120, 250, 400];
                case 'moderatelyAggressive':
                    return [10, 50, 90, 160, 350, 600];
                case 'aggressive':
                    return [10, 80, 160, 300, 500, 900];
                default:
                    return [];
            }
        }
    }

    angular
        .module('app')
        .service('portfolioSimulationService', portfolioSimulationService);
})();