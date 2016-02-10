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

    platformAllocation.$inject = ['flotChartService', '$timeout', 'onResizeService'];

    function platformAllocation(flotChartService, $timeout, onResizeService) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                identifier: "@"
            },
            link: (scope, elem) => {
                const onResizeCallbackId = 'platformAllocation';
                const options = flotChartService.pieChartOptions;

                scope.data.then(response => {
                    const data = flotChartService.prepareDataPlatformAllocation(response.data);

                    $timeout(() => {
                        setComputedDimensions();
                        $.plot(elem, data, options);
                    }, 500);

                    onResizeService.addOnResizeCallback(() => {
                        setComputedDimensions();
                        $.plot(elem, data, options);
                    }, onResizeCallbackId);
                });

                scope.$on('$destroy', function() {
                    onResizeService.removeOnResizeCallback(onResizeCallbackId);
                });

                function setComputedDimensions() {
                    const parentDir = elem.parent();
                    const style = `width:${parentDir.width()}px;height:200px`;
                    elem.attr('style', style);
                }
            }
        };
    }
})();
