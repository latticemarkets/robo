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

    loansMaturity.$inject = ['notificationService'];

    function loansMaturity(notificationService) {
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
                            columns: response.data.map(allocation => [allocation.originator, allocation.loansAcquired]),
                            type : 'pie'
                        },
                        size: {
                            height: 200,
                            width: 200
                        }
                    });
                }, notificationService.apiError());
            }
        };
    }
})();