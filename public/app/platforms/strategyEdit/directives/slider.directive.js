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
        .directive('sliderCriterion', sliderCriterion);

    sliderCriterion.$inject = ['$timeout'];

    function sliderCriterion($timeout) {
        return {
            restrict: 'A',
            scope: {
                criterion: '='
            },
            template: `<div>
                            <div class="row">
                                <h1 class="col-md-6">{{ criterion.slider.name }}</h1>
                                <span class="col-md-6"><h3 class="pull-right">{{ display }}</h3></span>
                            </div>
                            <rzslider rz-slider-model="criterion.ruleParams" rz-slider-options="options"></rzslider>
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
                    onEnd: (id, value) => $scope.display = $scope.criterion.slider.format(value),
                    onChange: (id, value) => $scope.display = $scope.criterion.slider.format(value),
                    hideLimitLabels: true
                };

                $scope.display = $scope.criterion.slider.format($scope.criterion.ruleParams);

                $timeout(function () {
                    $scope.$broadcast('reCalcViewDimensions');
                }, 500);
            }
        };
    }
})();
