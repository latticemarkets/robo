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

            const splineChartOption = {
                bindto: `#${vm.splineChartId}`,
                data: {
                    xs: {
                        'conservative': 'x'
                    },
                    columns: [
                        ['x', -5, 0, 6, 9, 10],
                        ['conservative', 0, 2.5, 10, 1, 0]
                    ],
                    types: {
                        conservative: 'area-spline'
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
                floor: 0,
                ceil: 10,
                step: 1,
                translate: () => "",
                onEnd: (id, value) => {},
                onChange: (id, value) => {},
                hideLimitLabels: true
            };
            vm.strategyValue = 0;

            function generateSplineChart() {
                c3.generate(splineChartOption);
            }
        }
    }
    
    angular
        .module('app')
        .controller('AutomatedStrategyEditController', AutomatedStrategyEditController);
})();