/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 19/02/2016
*/

(() => {
    'use strict';
    
    class AutomatedStrategyEditController {
        constructor(cssInjector, $timeout, onResizeService, $scope) {
            var vm = this;
            cssInjector.add("assets/stylesheets/homer_style.css");

            vm.splineChartId = "expectedReturnDistribution";
            //const parentDir = elem.parent();

            let chart;

            const splineChartOption = {
                bindto: `#${vm.splineChartId}`,
                data: {
                    xs: {
                        'distribution': 'x'
                    },
                    columns: [
                        ['x', -5, 0, 6, 9, 10],
                        ['distribution', 0, 2.5, 10, 1, 0]
                    ],
                    types: {
                        distribution: 'area-spline'
                    }
                },
                axis: {
                    x: {
                        tick: {
                            format: v => `${v}%`,
                            values: [-10, -5, 0, 5, 10, 15, 20]
                        },
                        min: -10,
                        max: 20
                    },
                    y: {
                        show: false
                    }
                },
                point: {
                    r: 0
                },
                legend: {
                    show: false
                }
            };

            $timeout(() => {
                generateSplineChart();
            }, 500);

            onResizeService.addOnResizeCallback(() => {
                generateSplineChart();
            }, vm.splineChartId);

            $scope.$on('$destroy', function() {
                onResizeService.removeOnResizeCallback(vm.splineChartId);
            });

            vm.strategySliderOptions = {
                floor: 0,
                ceil: 10,
                step: 1,
                translate: () => "",
                onChange: (id, value) => updateDistributionChart(value),
                onEnd: (id, value) => updateDistributionChart(value),
                hideLimitLabels: true
            };
            vm.strategyValue = 10;

            function generateSplineChart() {
                chart = c3.generate(splineChartOption);
            }

            const distributionColumns = [
                [['x', -7, -5, -2.5, 0, 2.5, 5, 6.5, 8.5, 11], ['distribution', 0, 0, 0.2, 1.5, 4, 8, 10, 1.5, 0]],
                [['x', -7, -5, -2.5, 0, 2.5, 5, 7, 8.5, 11], ['distribution', 0, 0.05, 0.6, 1.6, 3.9, 7.8, 10, 1.2, 0]],
                [['x', -7, -5, -2.5, 0, 2.5, 5, 7.5, 11, 12], ['distribution', 0, 0.1, 1, 1.8, 3.8, 7.7, 10, 1, 0]],
                [['x', -7, -5, -2.5, 0, 2.5, 5, 7.6, 11.5, 12], ['distribution', 0, 0.15, 1.1, 2, 3.8, 7.6, 10, 1, 0]],
                [['x', -7, -5, -2.5, 0, 2.5, 5, 7.8, 12, 12.5], ['distribution', 0, 0.2, 1.2, 2.2, 3.7, 7.5, 10, 1.2, 0]],
                [['x', -7, -5, -2.5, 0, 2.5, 5, 8, 13, 13.5], ['distribution', 0, 0.3, 1.2, 2.3, 3.85, 7.5, 10, 1, 0]],
                [['x', -7, -5, -2.5, 0, 2.5, 5, 8.2, 14, 15], ['distribution', 0, 0.5, 1.3, 2.4, 4, 7, 10, 1, 0]],
                [['x', -7, -5, -2.5, 0, 2.5, 5, 8.3, 14.5, 16], ['distribution', 0, 0.5, 1.4, 2.5, 4, 7, 10, 1, 0]],
                [['x', -7, -5, -2.5, 0, 2.5, 5, 8.4, 14.8, 16.5], ['distribution', 0, 0.5, 1.4, 2.5, 4, 7, 10, 1.2, 0]],
                [['x', -7, -5, -2.5, 0, 2.5, 5, 8.4, 15, 17], ['distribution', 0, 0.5, 1.5, 2.5, 4, 7, 10, 1.5, 0]]
            ];

            function updateDistributionChart(value) {
                chart.load({
                    columns: distributionColumns[value]
                });
            }

            $timeout(function () {
                $scope.$broadcast('reCalcViewDimensions');
            }, 500);
        }
    }
    
    angular
        .module('app')
        .controller('AutomatedStrategyEditController', AutomatedStrategyEditController);
})();