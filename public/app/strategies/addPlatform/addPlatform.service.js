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

        newPlatformModal() {
            var modalInstance = this.$uibModal.open({
                templateUrl: 'assets/app/strategies/addPlatform/addPlatform.modal.html',
                controller: AddPlatformModalController,
                resolve: {
                    constantsService: () => this.constantsService
                }
            });
        }
    }

    class AddPlatformModalController {
        constructor($scope, $uibModalInstance, constantsService) {
            $scope.platforms = constantsService.platformsImgExtensions;

            $scope.choose = () => {

            };

            $scope.cancel = () => {
                $uibModalInstance.dismiss('cancel');
            };
        }
    }

    angular
        .module('app')
        .controller('AddPlatformModalController', AddPlatformModalController)
        .service('addPlatformService', addPlatformService);
})();