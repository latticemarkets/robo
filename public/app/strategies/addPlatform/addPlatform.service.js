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

        newPlatformModal(platforms) {
            var modalInstance = this.$uibModal.open({
                templateUrl: 'assets/app/strategies/addPlatform/addPlatform.modal.html',
                controller: AddPlatformModalController,
                resolve: {
                    constantsService: () => this.constantsService,
                    platforms: () => platforms
                }
            });
        }
    }

    class AddPlatformModalController {
        constructor($scope, $uibModalInstance, constantsService, userService, authenticationService, $location, platforms) {
            $scope.platforms = constantsService.platformsImgExtensions;

            $scope.cancel = () => {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.steps = [
                {
                    templateUrl: 'assets/app/strategies/addPlatform/choosePlatform.step.html'
                },
                {
                    templateUrl: 'assets/app/strategies/addPlatform/setCredentials.step.html',
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

                var newPlatform = { name: $scope.chosePlatform, accountId: accountId, apiKey: apiKey, strategy: 'moderate', rules: [] };
                userService.addPlatform(authenticationService.getCurrentUsersEmail(), newPlatform,
                    () => {
                        finish();
                        $location.path(`/strategies/rules/${$scope.chosePlatform}`);
                });
            };

            $scope.alreadyAdded = platformName => {
                return platforms.some(platform => platform.name == platformName);
            };
        }
    }

    angular
        .module('app')
        .controller('AddPlatformModalController', AddPlatformModalController)
        .service('addPlatformService', addPlatformService);
})();