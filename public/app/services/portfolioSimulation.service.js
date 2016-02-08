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
                return Array.apply(null, new Array(120)).map((n, x) => x * x / j);
            }

            function generateMin(j) {
                return generateMedian(j).map(n => n * 0.9);
            }

            function generateMax(j) {
                return generateMedian(j).map(n => n * 1.1);
            }

            switch (portfolio) {
                case 'conservative':
                    return [
                        ['Max'].concat(generateMax(23)),
                        ['Simulation'].concat(generateMedian(23)),
                        ['Min'].concat(generateMin(23))
                    ];
                case 'moderateConservative':
                    return [
                        ['Max'].concat(generateMax(20)),
                        ['Simulation'].concat(generateMedian(20)),
                        ['Min'].concat(generateMin(20))
                    ];
                case 'moderate':
                    return [
                        ['Max'].concat(generateMax(16)),
                        ['Simulation'].concat(generateMedian(16)),
                        ['Min'].concat(generateMin(16))
                    ];
                case 'moderatelyAggressive':
                    return [
                        ['Max'].concat(generateMax(13)),
                        ['Simulation'].concat(generateMedian(13)),
                        ['Min'].concat(generateMin(13))
                    ];
                case 'aggressive':
                    return [
                        ['Max'].concat(generateMax(10)),
                        ['Simulation'].concat(generateMedian(10)),
                        ['Min'].concat(generateMin(10))
                    ];
                default:
                    return [];
            }
        }
    }

    angular
        .module('app')
        .service('portfolioSimulationService', portfolioSimulationService);
})();