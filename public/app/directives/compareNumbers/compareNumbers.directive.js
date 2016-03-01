/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 02/02/2016
*/

(() => {
    'use strict';

    angular
        .module('app')
        .directive('compareNumbers', compareNumbers);

    compareNumbers.$inject = ['$timeout'];

    function compareNumbers($timeout) {
        return {
            transclude: true,
            restrict: 'E',
            scope: {
                compared: '=compare',
                comparedTo: '=to'
            },
            template: '<span class="{{ result }}" data-ng-transclude></span>',
            link: (scope) => $timeout(() => scope.result = (scope.compared < scope.comparedTo) ? "text-danger" : "text-info")
        };
    }
})();
