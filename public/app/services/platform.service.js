/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 23/02/2016
*/

(() => {
    'use strict';

    class platformService {
        constructor($http, notificationService, authenticationService) {
            this.$http = $http;
            this.notificationService = notificationService;
            this.authenticationService = authenticationService;
        }

        getPlatforms(callback) {
            this.$http.get(`/api/user/platforms`)
                .then(callback, this.notificationService.apiError());
        }

        addPlatform(email, originator, accountId, apiKey, callback) {
            this.$http.post('/api/user/platform', { email: email, platform: {originator: originator, accountId: accountId, apiKey: apiKey}, callback: callback }).then(callback, this.notificationService.apiError());
        }

        updatePlatforms(platforms, callback, errorCallback) {
            this.$http.put('/api/user/p2pPlatforms', { platforms: platforms }).then(callback, this.notificationService.apiError(errorCallback));
        }

        updatePlatform(platform, callback) {
            const email = this.authenticationService.getCurrentUsersEmail();
            this.$http.put('/api/user/platform', { email: email, platform: platform }).then(callback, this.notificationService.apiError());
        }
    }

    angular
        .module('app')
        .service('platformService', platformService);
})();