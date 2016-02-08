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
            function generateValues(j) {
                return Array.apply(null, new Array(120)).map((n, x) => x * x / j);
            }

            switch (portfolio) {
                case 'conservative':
                    return [
                        ['Max'].concat(generateValues(17)),
                        ['Simulation'].concat(generateValues(23)),
                        ['Min'].concat(generateValues(35))
                    ];
                case 'moderateConservative':
                    return [
                        ['Max'].concat(generateValues(13)),
                        ['Simulation'].concat(generateValues(20)),
                        ['Min'].concat(generateValues(32))
                    ];
                case 'moderate':
                    return [
                        ['Max'].concat(generateValues(10)),
                        ['Simulation'].concat(generateValues(16)),
                        ['Min'].concat(generateValues(25))
                    ];
                case 'moderatelyAggressive':
                    return [
                        ['Max'].concat(generateValues(8)),
                        ['Simulation'].concat(generateValues(13)),
                        ['Min'].concat(generateValues(22))
                    ];
                case 'aggressive':
                    return [
                        ['Max'].concat(generateValues(7)),
                        ['Simulation'].concat(generateValues(10)),
                        ['Min'].concat(generateValues(17))
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