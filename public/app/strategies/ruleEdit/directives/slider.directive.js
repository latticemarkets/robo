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
                min: '=',
                max: '=',
                model: '=',
                format: '=',
                name: '='
            },
            template: `<div class="hpanel hblue">
                        <div class="panel-body">
                        <div class="row">
                            <h1 class="col-md-6">{{ name }}</h1>
                            <span class="col-md-6"><h3 class="pull-right">{{ display }}</h3></span>
                        </div>
                            <rzslider rz-slider-model="model" rz-slider-options="options"></rzslider>
                        </div>
                            <div class="panel-footer">
                            </div>
                        </div>
                       </div>`,
            controller($scope) {
                $scope.options = {
                    floor: $scope.min,
                    ceil: $scope.max,
                    translate: () => "",
                    onEnd: (id, value) => $scope.display = $scope.format(value),
                    onChange: (id, value) => $scope.display = $scope.format(value),
                    hideLimitLabels: true
                };

                $scope.display = $scope.format($scope.model);

                $timeout(function () {
                    $scope.$broadcast('reCalcViewDimensions');
                }, 500);
            }
        };
    }
})();
