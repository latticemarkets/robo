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
        constructor($http, notificationService, infosCacheService) {
            this.$http = $http;
            this.notificationService = notificationService;
            this.infosCacheService = infosCacheService;
        }

        getPlatforms(callback) {
            this.$http.get(`/api/user/platforms`)
                .then(callback, this.notificationService.apiError());
        }

        addPlatform(originator, accountId, apiKey, callback) {
            this.$http.post('/api/user/platform', { platform: {originator: originator, accountId: accountId, apiKey: apiKey}, callback: callback }).then(callback, this.notificationService.apiError());
            this.infosCacheService.getNumberOfPlatforms(nbPlatforms => this.infosCacheService.setNumberOfPlatforms(nbPlatforms + 1));
        }

        updatePlatforms(platforms, callback, errorCallback) {
            this.$http.put('/api/user/p2pPlatforms', { platforms: platforms }).then(callback, this.notificationService.apiError(errorCallback));
            this.infosCacheService.setNumberOfPlatforms(platforms.length);
        }

        updatePlatform(platform, callback) {
            this.$http.put('/api/user/platform', { platform: platform }).then(callback, this.notificationService.apiError());
        }
    }

    angular
        .module('app')
        .service('platformService', platformService);
})();