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

(function() {
    'use strict';

    class addPlatformService {

        constructor($uibModal, constantsService) {
            this.constantsService = constantsService;
            this.$uibModal = $uibModal;
        }

        newPlatformModal(platforms, callback) {
            var modalInstance = this.$uibModal.open({
                templateUrl: 'assets/app/platforms/addPlatform/addPlatform.modal.html',
                controller: AddPlatformModalController,
                resolve: {
                    constantsService: () => this.constantsService,
                    platforms: () => platforms,
                    callback: () => callback
                }
            });
        }
    }

    class AddPlatformModalController {
        constructor($scope, $uibModalInstance, constantsService, platformService, $timeout, platforms, callback) {
            $scope.platforms = constantsService.platformsImgExtensions;

            $scope.cancel = () => {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.steps = [
                {
                    templateUrl: 'assets/app/platforms/addPlatform/choosePlatform.step.html'
                },
                {
                    templateUrl: 'assets/app/platforms/addPlatform/setCredentials.step.html',
                    hasForm: true
                }
            ];

            $scope.choose = (platform, nextStep) => {
                if (!$scope.alreadyAdded(platform)) {
                    $scope.chosePlatform = platform;
                    nextStep();
                }
            };

            $scope.disableFinishButton = () => {
                const accountId = $('#accountId').val();
                const apiKey = $('#apiKey').val();

                return !(accountId && apiKey);
            };

            $scope.finish = finish => {
                const accountId = $('#accountId').val();
                const apiKey = $('#apiKey').val();

                if (accountId && apiKey) {
                    platformService.addPlatform($scope.chosePlatform, accountId, apiKey,
                        () => {
                            finish();
                            $timeout(() => callback(), 300);
                    });
                }
            };

            $scope.alreadyAdded = platformName => {
                return platforms.some(platform => platform.originator == platformName);
            };
        }
    }

    angular
        .module('app')
        .controller('AddPlatformModalController', AddPlatformModalController)
        .service('addPlatformService', addPlatformService);
})();