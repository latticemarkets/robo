/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 04/02/2016
*/

(() => {
    'use strict';

    class portfolioService {
        constructor($http, notificationService) {
            this.$http = $http;
            this.notificationService = notificationService;
        }

        getPortfolioSuggestion(terms, reason, income, timeline, birthday, callback) {
            this.$http.get('/api/portfolio/suggestion', {
                terms: terms,
                reason: reason,
                income: income,
                timeline: timeline,
                birthday: birthday
            }).then(callback, this.notificationService.apiError);
        }
    }

    angular
        .module('app')
        .service('portfolioService', portfolioService);
})();