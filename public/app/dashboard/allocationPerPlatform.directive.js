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
        .directive('platformAllocation', platformAllocation);

    platformAllocation.$inject = ['$timeout', 'onResizeService', 'chartService'];

    function platformAllocation($timeout, onResizeService, chartService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                data: "=",
                identifier: "@"
            },
            template: '<div id="{{identifier}}"></div>',
            link: (scope, elem) => {
                const onResizeCallbackId = 'platformAllocation';
                const parentDir = elem.parent();

                scope.data.then(response => {
                    const data = response.data.map(platform => [platform.originator, platform.loansAcquired]);
                    const colors = data.reduce((prev, column, index) => {
                        prev[column[0]] = chartService.blueDegraded[index];
                        return prev;
                    }, {});

                    $timeout(() => {
                        generatePieChart(data, scope.identifier, parentDir.width(), colors);
                    }, 500);

                    onResizeService.addOnResizeCallback(() => {
                        generatePieChart(data, scope.identifier, parentDir.width(), colors);
                    }, onResizeCallbackId);
                });

                scope.$on('$destroy', function() {
                    onResizeService.removeOnResizeCallback(onResizeCallbackId);
                });

                function generatePieChart(data, id, width, colors) {
                    console.log(colors);
                    c3.generate({
                        bindto: `#${id}`,
                        data: {
                            columns: data,
                            type: 'pie',
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
