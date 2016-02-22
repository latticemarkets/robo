/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 22/02/2016
*/

(() => {
    'use strict';

    class automatedStrategyEditService {
        constructor(notificationService, $http) {
            this.notificationService = notificationService;
            this.$http = $http;
        }

        saveStrategy(email, strategyValue, callback) {
            this.$http.put('/api/user/strategy/auto', { email: email, value: strategyValue })
                .then(callback, this.notificationService.apiError());
        }
    }

    angular
        .module('app')
        .service('automatedStrategyEditService', automatedStrategyEditService);
})();