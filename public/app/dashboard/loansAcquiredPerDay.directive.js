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

    loansAcquiredPerDay.$inject = ['flotChartService', '$timeout', 'onResizeService'];

    function loansAcquiredPerDay(flotChartService, $timeout, onResizeService) {
        return {
            restrict: 'A',
            scope: {
                promise: '='
            },
            link (scope, elem) {
                let onResizeCallbackId;

                scope.promise.then(response => {
                    const data = flotChartService.prepareDataLoansAcquiredPerDay(response.data);
                    const options = flotChartService.barChartOptions;

                    $timeout(() => {
                        setComputedDimensions();
                        $.plot(elem, data, options);
                    }, 500);

                    onResizeCallbackId = onResizeService.addOnResizeCallback(() => {
                        setComputedDimensions();
                        $.plot(elem, data, options);
                    });

                    scope.$on('$destroy', function() {
                        onResizeService.removeOnResizeCallback(onResizeCallbackId);
                    });
                });

                function setComputedDimensions() {
                    const parentDir = elem.parent();
                    const style = `width:${parentDir.width()}px;height:80px`;
                    elem.attr('style', style);
                }
            }
        };
    }
})();
