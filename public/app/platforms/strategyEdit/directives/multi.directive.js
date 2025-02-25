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
        .directive('multiCriterion', multiCriterion);

    multiCriterion.$inject = [];

    function multiCriterion() {
        return {
            restrict: 'A',
            scope: {
                criterion: '='
            },
            template: `<div>
                        <div class="row">
                            <h1 class="col-md-6">{{ criterion.multi.name }}</h1>
                            <span class="col-md-6"><h3 class="pull-right list-multi">{{ display }}</h3></span>
                        </div>
                        <span class="badge badge-multi-criterion badge-multi-criterion-any" data-ng-click="reset()">Any</span>
                        <span class="badge badge-multi-criterion {{ elem.value ? 'badge-multi-criterion-selected' : 'badge-info' }}" data-ng-click="select(elem)" data-ng-repeat="elem in criterion.multi.list">{{ elem.name }}</span>
                       </div>`,
            controller($scope) {
                $scope.criterion.multi.list = $scope.criterion.multi.list.map(elem => ({ name: elem, value: $scope.criterion.ruleParams.indexOf(elem) > -1}));

                $scope.reset = () => {
                    $scope.criterion.multi.list.map(elem => elem.value = false);
                    update();
                };

                $scope.select = elem => {
                    elem.value = !elem.value;
                    update();
                };

                update();

                function update() {
                    $scope.criterion.ruleParams = $scope.criterion.multi.list.filter(elem => elem.value).map(elem => elem.name);
                    $scope.display = $scope.criterion.multi.format($scope.criterion.ruleParams);
                }
            }
        };
    }
})();
