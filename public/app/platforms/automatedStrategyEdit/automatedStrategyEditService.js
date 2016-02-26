/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 25/02/2016
*/

(() => {
    'use strict';

    class automatedStrategyEditService {
        constructor(notificationService, $http, authenticationService, $routeParams, $location, constantsService) {
            this.notificationService = notificationService;
            this.$http = $http;
            this.authenticationService = authenticationService;
            this.$routeParams = $routeParams;
            this.$location = $location;
            this.constantsService = constantsService;
        }

        getStrategySimulations(originator, callback) {
            const email = this.authenticationService.getCurrentUsersEmail();
            this.$http.get(`/api/strategies/auto/simulation/${email}/${originator}`).then(callback, this.notificationService.apiError());
        }

        getPlatformFromUrl() {
            const platform = this.$routeParams.platform;
            if (!this.constantsService.platforms().some(realPlatform => realPlatform == platform)) {
                this.$location.path('/platforms');
                return undefined;
            }
            return platform;
        }
    }

    angular
        .module('app')
        .service('automatedStrategyEditService', automatedStrategyEditService);
})();