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

    loansMaturity.$inject = ['loansMaturityUtilsService', 'notificationService'];

    function loansMaturity(loansMaturityUtilsService, notificationService) {
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
                    scope.prepared = loansMaturityUtilsService.extractDataForScatterChart(response.data);
                    scope.xs = loansMaturityUtilsService.extractXs(scope.prepared);

                    const chart = c3.generate({
                        bindto: `#${scope.identifier}`,
                        data: {
                            xs: scope.xs,
                            columns: scope.prepared,
                            type: 'scatter'
                        },
                        axis: {
                            x: {
                                label: 'Months',
                                tick: {
                                    fit: false
                                }
                            },
                            y: {
                                label: 'Interest rate',
                                tick: {
                                    format: d3.format(",%")
                                }
                            }
                        },
                        point: {
                            r: 10
                        },
                        tooltip: {
                            format: {
                                title: months => `Mature in ${months} months`
                            }
                        }
                    });
                }, notificationService.apiError());
            }
        };
    }
})();