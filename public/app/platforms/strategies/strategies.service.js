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
        
        updateRules(rules, email, platform, market, callback, errorCallback) {
            this.$http.put('/api/user/rules', { rules: rules, email: email, platform: platform, market: market }).then(callback, this.notificationService.apiError(errorCallback));
        }
    }
    
    angular
        .module('app')
        .service('strategiesService', strategiesService);
})();