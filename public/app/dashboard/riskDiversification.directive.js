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

    riskDiversification.$inject = ['flotChartService', '$timeout', 'onResizeService'];

    function riskDiversification(flotChartService, $timeout, onResizeService) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                identifier: "@"
            },
            link: (scope, elem) => {
                let onResizeCallbackId;
                const options = flotChartService.donutChartOptions;

                scope.data.then(response => {
                    const data = flotChartService.prepareDataRiskDiversification(response.data);

                    $timeout(() => {
                        setComputedDimensions();
                        $.plot(elem, data, options);
                    }, 500);

                    onResizeCallbackId = onResizeService.addOnResizeCallback(() => {
                        setComputedDimensions();
                        $.plot(elem, data, options);
                    });
                });

                scope.$on('$destroy', function() {
                    onResizeService.removeOnResizeCallback(onResizeCallbackId);
                });

                function setComputedDimensions() {
                    const parentDir = elem.parent();
                    const style = `width:${parentDir.width()}px;height:180px`;
                    elem.attr('style', style);
                }
            }
        };
    }
})();