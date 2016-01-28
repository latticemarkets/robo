/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 27/01/2016
*/

(function () {
    'use strict';

    angular
        .module('app')
        .directive('progressBar', progressBar);

    progressBar.$inject = [];

    function progressBar() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                stepNo: '=',
                stepTotal: '='
            },
            template: '<div class="progress"> <div class="progress-bar" id="progressbar" role="progressbar" aria-valuenow="{{ value }}" aria-valuemin="0" aria-valuemax="100" style="width: {{ value }}%;"> </div> </div>',
            link: function(scope) {
                scope.value = (scope.stepNo / scope.stepTotal) * 100;
            }
        };
    }
})();
