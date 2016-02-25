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
        constructor(cssInjector, $timeout, onResizeService, $scope, autoStrategyChartsService, authenticationService, $location, $routeParams, constantsService, spinnerService, strategiesService, automatedStrategyEditService) {
            var vm = this;
            cssInjector.add("assets/stylesheets/homer_style.css");

            vm.splineChartId = "expectedReturnDistribution";
            vm.barChartId = "gradesDistributionChart";

            const platform = getPlatform();
            const email = authenticationService.getCurrentUsersEmail();

            strategiesService.getAutomatedStrategy(email, platform, strategyResponse =>
                automatedStrategyEditService.getStrategySimulations(platform, simulationResponse => {
                    vm.strategyValue = strategyResponse.data.aggressivity * 10;
                    vm.primaryMarketEnabled = strategyResponse.data.primaryMarketEnabled;
                    vm.secondaryMarketEnabled = strategyResponse.data.secondaryMarketEnabled;

                    vm.simulationSteps = simulationResponse.data.steps;

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

            vm.cancel = () => $location.path('/platforms');
            vm.save = () => {
                spinnerService.on();
                strategiesService.updateAutomatedStrategy(email, platform, vm.strategyValue / 10, vm.primaryMarketEnabled, vm.secondaryMarketEnabled,
                    () => {
                        spinnerService.off();
                        $location.path('/platforms');
                    }
                );
            };

            function getSplineChartOptions(sliderValue) {
                return autoStrategyChartsService.splineChartOptions(vm.splineChartId, vm.simulationSteps[sliderValue].strategyReturns);
            }

            function getBarChartOptions(sliderValue) {
                return autoStrategyChartsService.barChartOptions(vm.barChartId, $.map(vm.simulationSteps[sliderValue].portfolioComposition, elem => elem));
            }

            function generateCharts() {
                splineChart = c3.generate(getSplineChartOptions(vm.strategyValue));
                console.log(getBarChartOptions(vm.strategyValue));
                barChart = c3.generate(getBarChartOptions(vm.strategyValue));
            }

            function updateDistributionChart(sliderValue) {
                splineChart.load({
                    columns: autoStrategyChartsService.prepareSplineChartColumns(getSplineChartOptions(sliderValue))
                });
                barChart.load({
                    columns: autoStrategyChartsService.prepareBarChartColum(getBarChartOptions(sliderValue))
                });
            }

            function getPlatform() {
                const platform = $routeParams.platform;
                if (!constantsService.platforms().some(realPlatform => realPlatform == platform)) {
                    $location.path('/platforms');
                }
                return platform;
            }
        }
    }

    angular
        .module('app')
        .controller('AutomatedStrategyEditController', AutomatedStrategyEditController);
})();
