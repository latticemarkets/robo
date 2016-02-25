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
        constructor(notificationService, $http, authenticationService) {
            this.notificationService = notificationService;
            this.$http = $http;
            this.authenticationService = authenticationService;
        }

        getStrategySimulations(originator, callback) {
            const email = this.authenticationService.getCurrentUsersEmail();
            this.$http.get(`/api/strategies/auto/simulation/${email}/${originator}`).then(callback, this.notificationService.apiError());
        }
    }

    angular
        .module('app')
        .service('automatedStrategyEditService', automatedStrategyEditService);
})();