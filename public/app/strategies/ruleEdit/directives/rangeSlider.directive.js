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
        .directive('rangeSliderCriterion', sliderCriterion);

    sliderCriterion.$inject = ['$timeout'];

    function sliderCriterion($timeout) {
        return {
            restrict: 'A',
            scope: {
                criterion: '='
            },
            template: `<div class="hpanel hblue">
                        <div class="panel-body">
                        <div class="row">
                            <h1 class="col-md-6">{{ criterion.slider.name }}</h1>
                            <span class="col-md-6"><h3 class="pull-right">{{ display }}</h3></span>
                        </div>
                            <rzslider rz-slider-model="criterion.value" rz-slider-high="criterion.highValue" rz-slider-options="options"></rzslider>
                        </div>
                            <div class="panel-footer">
                            </div>
                        </div>
                       </div>`,
            controller($scope) {
                const min = $scope.criterion.slider.min || 0;
                const max = $scope.criterion.slider.max || null;
                const step = $scope.criterion.slider.step || 1;

                $scope.options = {
                    floor: min,
                    ceil: max,
                    step: step,
                    translate: () => "",
                    onEnd: (id, value, highValue) => $scope.display = $scope.criterion.slider.format(value, highValue),
                    onChange: (id, value, highValue) => $scope.display = $scope.criterion.slider.format(value, highValue),
                    hideLimitLabels: true,
                    noSwitching: true
                };

                $scope.display = $scope.criterion.slider.format($scope.criterion.value, $scope.criterion.highValue);

                $timeout(function () {
                    $scope.$broadcast('reCalcViewDimensions');
                }, 500);
            }
        };
    }
})();
