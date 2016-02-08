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

    portfolioSimulation.$inject = ['portfolioSimulationService', '$filter'];

    function portfolioSimulation(portfolioSimulationService, $filter) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                portfolio: '=',
                promise: '=',
                identifier: '@'
            },
            template: '<div id="{{identifier}}"></div>',
            link(scope, element) {
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
                                label: 'Years',
                                type: 'category',
                                categories: Array.apply(null, new Array(13)).map((n, i) => `Year ${i+1}`)
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
                        },
                        tooltip: {
                            format: {
                                title: x => new Date().getFullYear() + x,
                                value: value => $filter('currency')(value)
                            },
                            position: () => ({top: 25, left: element.width()/2-75}),
                            contents: d => `<div class="portfolio-simulation-tooltip">
                                <h4>Projected Value :</h4>
                                <h1 class="font-extra-bold m-t-xl m-b-xs fat-font">${$filter('currency')(d[1].value)}</h1>
                                </div>`
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