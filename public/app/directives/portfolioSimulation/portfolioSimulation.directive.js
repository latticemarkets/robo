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

    angular
        .module('app')
        .directive('portfolioSimulation', portfolioSimulation);

    portfolioSimulation.$inject = ['portfolioSimulationService'];

    function portfolioSimulation(portfolioSimulationService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                portfolio: '=',
                promise: '=',
                identifier: '@'
            },
            template: '<div id="{{identifier}}"></div>',
            link(scope) {
                const dataName = 'Simulation';
                let chart;

                scope.promise.then(response => {
                    var data = portfolioSimulationService.simulatedDataFor(response.data.portfolio);

                    chart = c3.generate({
                        bindto: `#${scope.identifier}`,
                        data: {
                            columns: [
                                [dataName].concat(data)
                            ],
                            type: 'spline'
                        },
                        axis: {
                            y: {
                                max: 1000,
                                min: 0,
                                padding: {top: 0, bottom: 0}
                            }
                        },
                        types: {
                            [dataName]: 'area-spline'
                        }
                    });
                });

                scope.$watch('portfolio', () => {
                    if (scope.portfolio) {
                        chart.load({
                            columns: [
                                [dataName].concat(portfolioSimulationService.simulatedDataFor(scope.portfolio))
                            ]
                        });
                    }
                });
            }
        };
    }
})();