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
                            values: [-5, 0, 5, 10, 15]
                        }
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
                floor: 1,
                ceil: 10,
                step: 1,
                translate: () => "",
                onEnd: (id, value) => updateDistributionChart(value),
                hideLimitLabels: true
            };
            vm.strategyValue = 10;

            function generateSplineChart() {
                chart = c3.generate(splineChartOption);
            }

            const conservativeColumns = [['x', -5, 0, 6, 9, 10], ['distribution', 0, 2.5, 10, 1, 0]];
            const aggressiveColumns = [['x', -8, -4, 0, 5, 9, 14, 15], ['distribution', 0, 0.5, 2, 8, 10, 1, 0]];

            function updateDistributionChart(value) {
                console.log(value);
                if (value < 5) {
                    chart.load({
                        columns: conservativeColumns
                    });
                }
                else {
                    chart.load({
                        columns: aggressiveColumns
                    });
                }
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