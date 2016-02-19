/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 17/02/2016
*/

(() => {
    'use strict';

    angular
        .module('app')
        .directive('textCriterion', textCriterion);

    textCriterion.$inject = [];

    function textCriterion() {
        return {
            restrict: 'A',
            scope: {
                criterion: '='
            },
            template: `<div>
                        <div class="row">
                            <h1 class="col-md-6">{{ criterion.text.name }}</h1>
                            <span class="col-md-6"><h3 class="pull-right list-multi">{{ display }}</h3></span>
                        </div>
                        <tags-input ng-model="criterion.ruleParams" on-tag-added="updateDisplay()" on-tag-removed="updateDisplay()"></tags-input>
                       </div>`,
            controller($scope) {
                $scope.updateDisplay = () => $scope.display = $scope.criterion.text.format($scope.criterion.ruleParams);

                $scope.updateDisplay();
            }
        };
    }
})();
