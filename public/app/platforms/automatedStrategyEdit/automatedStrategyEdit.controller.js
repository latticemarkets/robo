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
        constructor($timeout, onResizeService, $scope, autoStrategyChartsService, $location, spinnerService, strategiesService, automatedStrategyEditService, c3, SweetAlert) {
            var vm = this;

            vm.splineChartId = "expectedReturnDistribution";
            vm.barChartId = "gradesDistributionChart";

            const platform = automatedStrategyEditService.getPlatformFromUrl();

            strategiesService.getAutomatedStrategy(platform, strategyResponse =>
                automatedStrategyEditService.getStrategySimulations(platform, simulationResponse => {
                    vm.strategyValue = strategyResponse.data.aggressivity * 10;
                    vm.primaryMarketEnabled = strategyResponse.data.primaryMarketEnabled;
                    vm.secondaryMarketEnabled = strategyResponse.data.secondaryMarketEnabled;

                    vm.simulationSteps = simulationResponse.data.steps;

                    vm.median = () => vm.simulationSteps[vm.strategyValue].median;
                    vm.min95 = () => vm.simulationSteps[vm.strategyValue].min95;
                    vm.max95 = () => vm.simulationSteps[vm.strategyValue].max95;

                    $timeout(function () {
                        generateCharts();
                        $scope.$broadcast('reCalcViewDimensions');
                    }, 500);

                    onResizeService.addOnResizeCallback(() => {
                        generateCharts();
                    }, vm.splineChartId);

                    vm.strategySliderOptions = {
                        floor: 0,
                        ceil: 100,
                        step: 1,
                        translate: () => "",
                        onChange: (id, value) => updateDistributionChart(value),
                        onEnd: (id, value) => updateDistributionChart(value),
                        hideLimitLabels: true
                    };
            }));

            let splineChart;
            let barChart;

            $scope.$on('$destroy', function() {
                onResizeService.removeOnResizeCallback(vm.splineChartId);
            });

            vm.cancel = () =>
                SweetAlert.swal({
                    title: "Are you sure?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: true,
                    closeOnCancel: true
                }, isConfirm => {
                    if (isConfirm) {
                        $location.path('/platforms');
                    }
                }
            );

            vm.save = () => {
                spinnerService.on();
                strategiesService.updateAutomatedStrategy(platform, vm.strategyValue / 10, vm.primaryMarketEnabled, vm.secondaryMarketEnabled,
                    () => {
                        spinnerService.off();
                        $location.path('/platforms');
                    }
                );
            };

            function generateCharts() {
                splineChart = c3.generate(autoStrategyChartsService.getSplineChartOptions(vm.strategyValue, vm.splineChartId, vm.simulationSteps));
                barChart = c3.generate(autoStrategyChartsService.getBarChartOptions(vm.strategyValue, vm.barChartId, vm.simulationSteps));
            }

            function updateDistributionChart(sliderValue) {
                splineChart.load({
                    columns: autoStrategyChartsService.prepareSplineChartColumns(sliderValue, vm.simulationSteps)
                });
                barChart.load({
                    columns: autoStrategyChartsService.prepareBarChartColumn(sliderValue, vm.simulationSteps)
                });
            }
        }
    }

    angular
        .module('app')
        .controller('AutomatedStrategyEditController', AutomatedStrategyEditController);
})();
