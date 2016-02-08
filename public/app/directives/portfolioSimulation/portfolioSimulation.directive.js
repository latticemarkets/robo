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
                            columns: data,
                            types: {
                                Max: 'area-spline',
                                Simulation: 'spline',
                                Min: 'area-spline'
                            },
                            colors: {
                                Max: 'rgb(215, 232, 248)',
                                Simulation: 'rgb(120, 178, 235)',
                                Min: '#fff'
                            }
                        },
                        axis: {
                            x: {
                                label: 'Years'
                            },
                            y: {
                                max: 2000,
                                min: 0,
                                padding: {top: 0, bottom: 0},
                                label: 'ROI ($)'
                            }
                        },
                        point: {
                            show: false
                        },
                        legend: {
                            show: false
                        }
                    });
                });

                scope.$watch('portfolio', () => {
                    if (scope.portfolio) {
                        chart.load({
                            columns: portfolioSimulationService.simulatedDataFor(scope.portfolio)
                        });
                    }
                });
            }
        };
    }
})();