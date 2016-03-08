/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 07/03/2016
*/

(() => {
    'use strict';

    angular
        .module('app')
        .directive('minimalizaSidebar', minimalizaSidebar);

    minimalizaSidebar.$inject = [];

    function minimalizaSidebar() {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize btn btn-info" href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: function ($scope) {
                $scope.minimalize = function () {
                    if ($(window).width() < 769) {
                        $("body").toggleClass("show-sidebar");
                    } else {
                        $("body").toggleClass("hide-sidebar");
                    }
                };
            }
        };
    }
})();
