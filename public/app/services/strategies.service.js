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

        updateStrategies(strategies, platform, market, callback, errorCallback) {
            if (market === 'primary') {
                this.$http.put('/api/strategies/primary/buy', { strategies: strategies, platform: platform }).then(callback, this.notificationService.apiError(errorCallback));
            }
            else {
                this.$http.put('/api/strategies/secondary/buy', { strategies: strategies, platform: platform }).then(callback, this.notificationService.apiError(errorCallback));
            }
        }

        updateAutomatedStrategy(platform, aggressivity, primaryMarketEnabled, secondaryMarketEnabled, callback) {
            this.$http.put('/api/strategies/auto', {
                    platform: platform,
                    autoStrategy: {
                        aggressivity: aggressivity,
                        primaryMarketEnabled: primaryMarketEnabled,
                        secondaryMarketEnabled: secondaryMarketEnabled
                    }
                })
                .then(callback, this.notificationService.apiError());
        }

        getAutomatedStrategy(platform, callback) {
            this.$http.get(`/api/strategies/auto/${platform}`)
                .then(callback, this.notificationService.apiError());
        }
    }
    
    angular
        .module('app')
        .service('strategiesService', strategiesService);
})();