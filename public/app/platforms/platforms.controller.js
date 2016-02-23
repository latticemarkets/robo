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
        constructor(cssInjector, authenticationService, constantsService, $filter, addPlatformService, $scope, spinnerService, $location, platformService) {
            var vm = this;

            const email = authenticationService.getCurrentUsersEmail();

            cssInjector.add("assets/stylesheets/homer_style.css");

            platformService.getPlatforms(email, response => {
                vm.platforms = response.data;

                vm.platforms.forEach(platform => {
                    platform.isAuto = platform.mode === 'automated';

                    $scope.$watch(() => platform.isAuto, () => {
                        spinnerService.on();
                        platform.mode = platform.isAuto ? 'automated' : 'manual';
                        const tmpPlatforms = JSON.parse(JSON.stringify(vm.platforms)).map(p => {
                            delete p.isAuto;
                            return p;
                        });
                        platformService.updatePlatforms(email, tmpPlatforms, () => spinnerService.off(), () => {
                            platform.mode = platform.isAuto ? 'automated' : 'manual';
                            platform.isAuto = !platform.isAuto;
                        });
                    });
                });
            });

            vm.platformsImgExtensions = constantsService.platformsImgExtensions;

            vm.totalExpected = platform => computeExpectedReturn(platform.primary);
            vm.fromCamelCaseToTitle = str => $filter('titlecase')($filter('camelCaseToHuman')(str));

            vm.newPlatform = () => addPlatformService.newPlatformModal(vm.platforms);

            vm.editStrategy = (mode, name) => mode === 'automated' ? $location.path(`platforms/strategies/${name}/auto`) : $location.path(`platforms/strategies/${name}/primary`);

            function computeExpectedReturn(market) {
                return market.buyStrategies.reduce((prev, strategy) => strategy.expectedReturn.value + prev, 0);
            }
        }
    }

    angular
        .module('app')
        .controller('PlatformsController', PlatformsController);
})();