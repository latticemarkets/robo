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
        constructor(constantsService, $filter, addPlatformService, $scope, spinnerService, $location, platformService, platformSettingsService) {
            var vm = this;

            getPlatforms();

            vm.platformsImgExtensions = constantsService.platformsImgExtensions;

            vm.totalExpected = platform => computeExpectedReturn(platform.primary);

            vm.fromCamelCaseToTitle = str => $filter('titlecase')($filter('camelCaseToHuman')(str));

            vm.newPlatform = () => addPlatformService.newPlatformModal(vm.platforms, () => getPlatforms());

            vm.editStrategy = (mode, name) => mode === 'automated' ? $location.path(`platforms/strategies/${name}/auto`) : $location.path(`platforms/strategies/${name}/primary`);

            vm.platformSettings = platform => platformSettingsService.platformSettingsModal(platform);

            function refreshAllPlatformLinked(){
              const platformsName = constantsService.platforms();
              const userPlatforms = vm.platforms.map(p => p.originator);
              vm.allPlatformLinked = platformsName.some(p => userPlatforms.indexOf(p) < 0);
            }

            function computeExpectedReturn(market) {
                return market.buyStrategies.reduce((prev, strategy) => strategy.expectedReturn.value + prev, 0);
            }

            function getPlatforms() {
                platformService.getPlatforms(response => {
                    vm.platforms = response.data;
                    refreshAllPlatformLinked();
                    vm.platforms.forEach(platform => {
                        platform.isAuto = platform.mode === 'automated';

                        $scope.$watch(() => platform.isAuto, (oldValue, newValue) => {
                          if (oldValue !== null && oldValue != newValue) {
                              spinnerService.on();
                              platform.mode = platform.isAuto ? 'automated' : 'manual';
                              const tmpPlatforms = JSON.parse(JSON.stringify(vm.platforms)).map(p => {
                                  delete p.isAuto;
                                  return p;
                              });
                              platformService.updatePlatforms(tmpPlatforms, () => spinnerService.off(), () => {
                                  platform.mode = platform.isAuto ? 'automated' : 'manual';
                                  platform.isAuto = !platform.isAuto;
                              });
                          }
                        });
                    });
                });
            }
        }
    }

    angular
        .module('app')
        .controller('PlatformsController', PlatformsController);
})();
