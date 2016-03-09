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

    loansMaturity.$inject = ['loansMaturityUtilsService', 'notificationService', '$timeout', 'responsiveService'];

    function loansMaturity(loansMaturityUtilsService, notificationService, $timeout, responsiveService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                data: "=",
                identifier: "@"
            },
            template: '<div id="{{identifier}}"></div>',
            link: (scope, elem) => {
                const onResizeCallbackId = "loansMaturity";
                const parentDir = elem.parent();

                scope.data.then(response => {
                    const preparedData = loansMaturityUtilsService.extractDataForScatterChart(response.data);
                    const xs = loansMaturityUtilsService.extractXs(preparedData);

                    $timeout(() => {
                        generateScatterChart();
                    }, 500);

                    responsiveService.addOnResizeCallback(() => {
                        generateScatterChart();
                    }, onResizeCallbackId);

                    scope.$on('$destroy', function() {
                        responsiveService.removeOnResizeCallback(onResizeCallbackId);
                    });

                    function generateScatterChart() {
                        c3.generate(loansMaturityUtilsService.chartOptions(scope.identifier, preparedData, xs, parentDir[0].clientWidth));
                    }

                }, notificationService.apiError());
            }
        };
    }
})();