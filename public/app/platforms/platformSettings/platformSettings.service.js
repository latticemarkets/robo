/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 24/02/2016
*/

(() => {
    'use strict';

    class platformSettingsService {
        constructor($uibModal) {
            this.$uibModal = $uibModal;
        }

        platformSettingsModal(platform) {
            var modalInstance = this.$uibModal.open({
                templateUrl: 'assets/app/platforms/platformSettings/platformSettings.modal.html',
                controller: PlatformSettingsModalController,
                resolve: {
                    platform: () => platform
                }
            });
        }
    }

    class PlatformSettingsModalController {
        constructor($scope, $uibModalInstance, $timeout, platform) {
            $scope.originator = platform.originator;

            $timeout(() => $scope.maximumDailyInvestment = platform.maximumDailyInvestment);

            $scope.cancel = () => {
                $uibModalInstance.dismiss('cancel');
            };
        }
    }

    angular
        .module('app')
        .controller('PlatformSettingsModalController', PlatformSettingsModalController)
        .service('platformSettingsService', platformSettingsService);
})();