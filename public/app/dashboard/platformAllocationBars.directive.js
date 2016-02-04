/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 04/02/2016
*/

(() => {
    'use strict';

    angular
        .module('app')
        .directive('platformAllocationBars', platformAllocationBars);

    platformAllocationBars.$inject = [];

    function platformAllocationBars() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                promise: '='
            },
            templateUrl: '/assets/app/dashboard/platformAllocationBars.part.html',
            link(scope) {
                scope.promise.then(response => {
                    scope.platformAllocationBars = response.data.map(platform => ({ name: platform.originator, value: platform.loansAcquired }));
                    var x = response.data.map(platform => platform.loansAcquired);
                    scope.max = Math.max.apply(Math, x);
                });
            }
        };
    }
})();
