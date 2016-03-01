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

    loansAcquiredPerDay.$inject = ['$timeout', 'onResizeService', 'notificationService'];

    function loansAcquiredPerDay($timeout, onResizeService, notificationService) {
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
                    const data = ['Investment this week'].concat(response.data);

                    $timeout(() => {
                        generateBarChart(data, scope.identifier, parentDir.width(), parentDir.height());
                    }, 500);

                    onResizeService.addOnResizeCallback(() => {
                        generateBarChart(data, scope.identifier, parentDir.width(), parentDir.height());
                    }, onResizeCallbackId);

                    scope.$on('$destroy', function() {
                        onResizeService.removeOnResizeCallback(onResizeCallbackId);
                    });
                }, notificationService.apiError());

                function generateBarChart(data, id, width, height) {
                    c3.generate({
                        bindto: `#${id}`,
                        data: {
                            columns: [data],
                            type: 'bar'
                        },
                        bar: {
                            width: {
                                ratio: 0.5
                            }
                        },
                        size: {
                            width: width,
                            height: height
                        }
                    });
                }
            }
        };
    }
})();
