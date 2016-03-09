/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 10/02/2016
*/

(() => {
    'use strict';

    angular
        .module('app')
        .directive('loansAcquiredPerDay', loansAcquiredPerDay);

    loansAcquiredPerDay.$inject = ['$timeout', 'responsiveService', 'notificationService', '$filter'];

    function loansAcquiredPerDay($timeout, responsiveService, notificationService, $filter) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                identifier: '@',
                data: '='
            },
            template: '<div id="{{identifier}}"></div>',
            link (scope, elem) {
                const onResizeCallbackId = 'loansAcquiredPerDay';
                const parentDir = elem.parent();

                scope.data.then(response => {
                    const data = response.data;

                    $timeout(() => {
                        generateBarChart(data, scope.identifier, parentDir[0].clientWidth, parentDir[0].clientHeight);
                    }, 500);

                    responsiveService.addOnResizeCallback(() => {
                        generateBarChart(data, scope.identifier, parentDir[0].clientWidth, parentDir[0].clientHeight);
                    }, onResizeCallbackId);

                    scope.$on('$destroy', function() {
                        responsiveService.removeOnResizeCallback(onResizeCallbackId);
                    });
                }, notificationService.apiError());

                function generateBarChart(data, id, width, height) {
                    c3.generate({
                        bindto: `#${id}`,
                        data: {
                            columns: [['Investment this week'].concat(data)],
                            type: 'bar',
                            colors: {
                                'Investment this week': '#3498db'
                            }
                        },
                        bar: {
                            width: {
                                ratio: 0.5
                            }
                        },
                        size: {
                            width: width,
                            height: height
                        },
                        legend: {
                            show: false
                        },
                        axis: {
                            x: {
                                tick: {
                                    format: x => ['M', 'T', 'W', 'T', 'F', 'S', 'S'][x]
                                }
                            },
                            y: {
                                show: false
                            }
                        },
                        tooltip: {
                            format: {
                                value: value => $filter('currency')(value)
                            }
                        }

                    });
                }
            }
        };
    }
})();
