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
        
    class rulesService {
        constructor($http, $timeout) {
            this.$http = $http;
            this.$timeout = $timeout;
        }
        
        updateRules(rules, callback) {
            //this.$http.put('/api/user/rules/', { rules: rules }).then(callback, notificationService.apiError());
            this.$timeout(() => callback(), 1000);
        }
    }
    
    angular
        .module('app')
        .service('rulesService', rulesService);
})();