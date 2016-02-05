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

    riskDiversification.$inject = ['notificationService', 'c3PieChartService', '$filter'];

    function riskDiversification(notificationService, c3PieChartService, $filter) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                data: "=",
                identifier: "@"
            },
            template: '<div id="{{identifier}}"></div>',
            link: scope => {
                scope.data.then(response => {
                    const chart = c3.generate({
                        bindto: `#${scope.identifier}`,
                        data: {
                            columns: c3PieChartService.prepareRiskDiversificationData(response.data),
                            type : 'donut'
                        },
                        size: {
                            height: 200,
                            width: 300
                        },
                        tooltip: {
                            position: () => ({top: 0, left: 0}),
                            format:{
                                value: (value, ratio) => `${value} loans | ${$filter('percent')(ratio, 1)}`
                            }
                        },
                        color: {
                            pattern: c3PieChartService.blueDegraded
                        },
                        legend:{
                            show: false
                        },
                        donut: {
                            label: {
                                show: false
                            }
                        }
                    });
                }, notificationService.apiError());
            }
        };
    }
})();