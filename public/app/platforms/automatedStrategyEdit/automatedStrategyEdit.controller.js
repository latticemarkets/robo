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
        constructor(cssInjector, $timeout, onResizeService, $scope, autoStrategyChartsService) {
            var vm = this;
            cssInjector.add("assets/stylesheets/homer_style.css");

            vm.splineChartId = "expectedReturnDistribution";
            vm.barChartId = "gradesDistributionChart";
            //const parentDir = elem.parent();

            vm.strategyValue = 3;

            let splineChart;
            let barChart;



            const barChartOptions = {
                bindto: `#${vm.barChartId}`,
                data: {
                    columns: autoStrategyChartsService.simulatedBarChartDataForStrategy(vm.strategyValue),
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
                splineChart = c3.generate(autoStrategyChartsService.splineChartOptions(vm.splineChartId, vm.strategyValue));
                barChart = c3.generate(barChartOptions);
            }

            function updateDistributionChart(value) {
                splineChart.load({
                    columns: autoStrategyChartsService.simulatedSplineChartDataForStrategy(value)
                });
                barChart.load({
                    columns: autoStrategyChartsService.simulatedBarChartDataForStrategy(value)
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