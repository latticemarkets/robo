/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 12/02/2016
*/

(() => {
    'use strict';
        
    class strategiesService {
        constructor($http, $timeout, notificationService) {
            this.$http = $http;
            this.$timeout = $timeout;
            this.notificationService = notificationService;
        }

        updateStrategies(strategies, email, platform, market, callback, errorCallback) {
            if (market === 'primary') {
                this.$http.put('/api/strategies/primary/buy', { strategies: strategies, email: email, platform: platform }).then(callback, this.notificationService.apiError(errorCallback));
            }
            else {
                this.$http.put('/api/strategies/secondary/buy', { strategies: strategies, email: email, platform: platform }).then(callback, this.notificationService.apiError(errorCallback));
            }
        }

        updateAutomatedStrategy(email, platform, aggressivity, callback) {
            this.$http.put('/api/strategies/auto', { email: email, platform: platform, autoStrategy: { aggressivity: aggressivity } })
                .then(callback, this.notificationService.apiError());
        }
    }
    
    angular
        .module('app')
        .service('strategiesService', strategiesService);
})();