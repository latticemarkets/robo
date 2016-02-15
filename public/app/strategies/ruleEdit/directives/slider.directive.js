/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 15/02/2016
*/

(() => {
    'use strict';

    angular
        .module('app')
        .directive('sliderCriterion', slider);

    slider.$inject = ['$timeout'];

    function slider($timeout) {
        return {
            restrict: 'E',
            scope: {
                min: '=',
                max: '=',
                format: '=',
                model: '='
            },
            template: '<rzslider rz-slider-model="model" rz-slider-options="options"></rzslider>',
            link(scope) {
                scope.options = {
                    floor: scope.min,
                    ceil: scope.max
                };

                $timeout(function () {
                    scope.$broadcast('rzSliderForceRender');
                }, 500);
            }
        };
    }
})();
