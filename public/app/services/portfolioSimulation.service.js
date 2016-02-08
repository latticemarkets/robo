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
            function generateMedian(j) {
                return Array.apply(null, new Array(13)).map((n, x) => x * x * j);
            }

            function generateMin(j) {
                return generateMedian(j).map(n => n * 0.9);
            }

            function generateMax(j) {
                return generateMedian(j).map(n => n * 1.1);
            }

            function generateValues(n) {
                return [
                    ['Max'].concat(generateMax(n)),
                    ['Simulation'].concat(generateMedian(n)),
                    ['Min'].concat(generateMin(n))
                ];
            }

            switch (portfolio) {
                case 'conservative':
                    return generateValues(6);
                case 'moderateConservative':
                    return generateValues(8);
                case 'moderate':
                    return generateValues(10);
                case 'moderatelyAggressive':
                    return generateValues(13);
                case 'aggressive':
                    return generateValues(16);
                default:
                    return [];
            }
        }
    }

    angular
        .module('app')
        .service('portfolioSimulationService', portfolioSimulationService);
})();