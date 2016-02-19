/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 11/02/2016
*/

(() => {
    'use strict';

    class PlatformsController {
        constructor(cssInjector, userService, authenticationService, constantsService, $filter, addPlatformService, $scope) {
            var vm = this;

            const email = authenticationService.getCurrentUsersEmail();

            cssInjector.add("assets/stylesheets/homer_style.css");

            userService.userData(email, response => {
                vm.platforms = response.data.platforms;

                vm.platforms.forEach(platform =>
                    $scope.$watch(() => platform.autoEnabled, () =>
                        userService.updatePlatforms(email, vm.platforms, () => {}, () => platform.autoEnabled = !platform.autoEnabled))
                );
            });

            vm.platformsImgExtensions = constantsService.platformsImgExtensions;

            vm.totalExpected = platform => computeExpectedReturn(platform.primary) + computeExpectedReturn(platform.secondary);
            vm.fromCamelCaseToTitle = str => $filter('titlecase')($filter('camelCaseToHuman')(str));

            vm.newPlatform = () => addPlatformService.newPlatformModal(vm.platforms);

            function computeExpectedReturn(market) {
                return market.rules.reduce((prev, rule) => rule.expectedReturn.value + prev, 0);
            }
        }
    }

    angular
        .module('app')
        .controller('PlatformsController', PlatformsController);
})();