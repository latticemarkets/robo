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
            vm.barChartId = "gradesDistributionChart";
            //const parentDir = elem.parent();

            vm.strategyValue = 3;

            let splineChart;
            let barChart;

            const splineDistributionColumns = [
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

            const barDistributionColumns = [
                [['Estimated Loan Distribution', 0.1, 10, 0, 0, 0, 0, 0]],
                [['Estimated Loan Distribution', 0.1, 10, 0, 0.2, 0, 0, 0]],
                [['Estimated Loan Distribution', 0.1, 10, 0.15, 0.3, 0.2, 0, 0]],
                [['Estimated Loan Distribution', 0.1, 10, 0.3, 1, 0.5, 0.1, 0]],
                [['Estimated Loan Distribution', 0.1, 10, 0.6, 2, 1, 0.3, 0]],
                [['Estimated Loan Distribution', 0.1, 10, 0.9, 5, 2.5, 0.4, 0]],
                [['Estimated Loan Distribution', 0.1, 10, 1.4, 7.5, 3.2, 0.6, 0]],
                [['Estimated Loan Distribution', 0, 8, 2.5, 10, 3.5, 0.7, 0]],
                [['Estimated Loan Distribution', 0, 5, 3, 10, 5, 0.7, 0]],
                [['Estimated Loan Distribution', 0, 2, 3, 10, 5, 0.7, 0]],
                [['Estimated Loan Distribution', 0, 0, 3, 10, 5, 0.7, 0]]
            ];

            const splineChartOptions = {
                bindto: `#${vm.splineChartId}`,
                data: {
                    xs: {
                        'distribution': 'x'
                    },
                    columns: splineDistributionColumns[vm.strategyValue],
                    types: {
                        distribution: 'area-spline'
                    },
                    colors: {
                        'distribution': '#3498db'
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

            const barChartOptions = {
                bindto: `#${vm.barChartId}`,
                data: {
                    columns: barDistributionColumns[vm.strategyValue],
                    type: 'bar',
                    colors: {
                        'Estimated Loan Distribution': '#3498db'
                    }
                },
                axis: {
                    x: {
                        tick: {
                            format: v => `${['A', 'B', 'C', 'D', 'E', 'F', 'G'][v]}`
                        }
                    },
                    y: {
                        show: false
                    }
                }
            };

            $timeout(() => {
                generateCharts();
            }, 500);

            onResizeService.addOnResizeCallback(() => {
                generateCharts();
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

            function generateCharts() {
                splineChart = c3.generate(splineChartOptions);
                barChart = c3.generate(barChartOptions);
            }

            function updateDistributionChart(value) {
                splineChart.load({
                    columns: splineDistributionColumns[value]
                });
                barChart.load({
                    columns: barDistributionColumns[value]
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