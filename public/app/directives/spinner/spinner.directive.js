/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 13/02/2016
*/

(() => {
    'use strict';

    angular
        .module('app')
        .directive('spinner', spinner);

    spinner.$inject = ['spinnerService'];

    function spinner(spinnerService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {},
            template: `<div data-ng-show="spinner" class="sk-spinner sk-spinner-circle pull-right">
            <div class="sk-spinner sk-spinner-circle">
            <div class="sk-circle1 sk-circle"></div>
            <div class="sk-circle2 sk-circle"></div>
            <div class="sk-circle3 sk-circle"></div>
            <div class="sk-circle4 sk-circle"></div>
            <div class="sk-circle5 sk-circle"></div>
            <div class="sk-circle6 sk-circle"></div>
            <div class="sk-circle7 sk-circle"></div>
            <div class="sk-circle8 sk-circle"></div>
            <div class="sk-circle9 sk-circle"></div>
            <div class="sk-circle10 sk-circle"></div>
            <div class="sk-circle11 sk-circle"></div>
            <div class="sk-circle12 sk-circle"></div>
            </div>
            </div>`,
            link(scope) {
                spinnerService.listenSpinnerValue(spinner => scope.spinner = spinner);
            }
        };
    }
})();
