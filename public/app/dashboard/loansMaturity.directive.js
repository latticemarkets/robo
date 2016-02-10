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
        .directive('loansMaturity', loansMaturity);

    loansMaturity.$inject = ['loansMaturityUtilsService', 'notificationService', '$timeout'];

    function loansMaturity(loansMaturityUtilsService, notificationService, $timeout) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                data: "=",
                identifier: "@"
            },
            template: '<div id="{{identifier}}"></div>',
            link: (scope, elem) => {
                const parentDir = elem.parent();

                scope.data.then(response => {
                    const preparedData = loansMaturityUtilsService.extractDataForScatterChart(response.data);
                    const xs = loansMaturityUtilsService.extractXs(preparedData);

                    $timeout(() => {
                        c3.generate(loansMaturityUtilsService.chartOptions(scope.identifier, preparedData, xs, parentDir.width()));
                    }, 500);
                }, notificationService.apiError());
            }
        };
    }
})();