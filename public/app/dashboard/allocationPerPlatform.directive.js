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
        .directive('platformAllocation', loansMaturity);

    loansMaturity.$inject = ['notificationService', '$filter'];

    function loansMaturity(notificationService, $filter) {
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
                        bindto: "#allocation-pie",
                        data: {
                            columns: response.data.map(allocation => [$filter('titlecase')($filter('camelCaseToHuman')(allocation.originator)), allocation.loansAcquired]),
                            type : 'pie'
                        },
                        size: {
                            height: 200,
                            width: 300
                        },
                        tooltip: {
                            position: function (data, width, height, element) {
                                return {top: 30, left: 0};
                            }
                        }
                    });
                }, notificationService.apiError());
            }
        };
    }
})();