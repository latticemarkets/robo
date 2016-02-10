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

    loansAcquiredPerDay.$inject = ['loansAcquiredService', '$timeout'];

    function loansAcquiredPerDay(loansAcquiredService, $timeout) {
        return {
            restrict: 'A',
            scope: {
                promise: '='
            },
            link (scope, elem) {
                scope.promise.then(response => {
                    const data = loansAcquiredService.prepareData(response.data);
                    const options = loansAcquiredService.barChartOptions;

                    $timeout(() => {
                        setComputedDimensions();
                        $.plot(elem, data, options);
                    }, 500);

                    window.onresize = () => {
                        setComputedDimensions();
                        $.plot(elem, data, options);
                    };
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
