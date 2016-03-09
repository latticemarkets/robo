/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 03/02/2016
*/

(() => {
    'use strict';

    angular
        .module('app')
        .directive('riskDiversification', riskDiversification);

    riskDiversification.$inject = ['$timeout', 'responsiveService', 'chartService'];

    function riskDiversification($timeout, responsiveService, chartService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                data: "=",
                identifier: "@"
            },
            template: '<div id="{{identifier}}"></div>',
            link: (scope, elem) => {
                const onResizeCallbackId = 'riskDiversification';
                const parentDir = elem.parent();

                scope.data.then(response => {
                    const data = response.data.map(platform => [platform.grade, platform.value]);
                    const colors = data.reduce((prev, column, index) => {
                        prev[column[0]] = chartService.blueDegraded[index];
                        return prev;
                    }, {});

                    $timeout(() => {
                        generateDonutChart(data, scope.identifier, parentDir[0].clientWidth, colors);
                    }, 500);

                    responsiveService.addOnResizeCallback(() => {
                        generateDonutChart(data, scope.identifier, parentDir[0].clientWidth, colors);
                    }, onResizeCallbackId);
                });

                scope.$on('$destroy', function() {
                    responsiveService.removeOnResizeCallback(onResizeCallbackId);
                });

                function generateDonutChart(data, id, width, colors) {
                    c3.generate({
                        bindto: `#${id}`,
                        data: {
                            columns: data,
                            type: 'donut',
                            colors: colors
                        },
                        size: {
                            width: width
                        }
                    });
                }
            }
        };
    }
})();