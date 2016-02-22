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
                    columns: [
                        ['distribution', 300, 350, 300, 0, 0, 0]
                    ],
                    types: {
                        distribution: 'area-spline'
                    }
                },
                //size: {
                //    width: parentDir.width()
                //}
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


            function generateSplineChart() {
                c3.generate(splineChartOption);
            }
        }
    }
    
    angular
        .module('app')
        .controller('AutomatedStrategyEditController', AutomatedStrategyEditController);
})();