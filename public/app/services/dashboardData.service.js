/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
 * @author : julienderay
 * Created on 01/02/2016
 */

(() => {
    'use strict';

    class dashboardDataService {
        constructor($http) {
            this.$http = $http;
        }

        availableCapital(callback) {
            return this.$http.get('/api/dashboard/capital/available').then(callback);
        }

        allocatedCapital(callback) {
            return this.$http.get('/api/dashboard/capital/allocated').then(callback);
        }

        averageMaturity(callback) {
            return this.$http.get('/api/dashboard/averageMaturity').then(callback);
        }

        averageIntRate(callback) {
            return this.$http.get('/api/dashboard/averageIntRate').then(callback);
        }

        expectedReturns(callback) {
            return this.$http.get('/api/dashboard/expectedReturns').then(callback);
        }

        lastLoanMaturity(callback) {
            return this.$http.get('/api/dashboard/lastLoanMaturity').then(callback);
        }
    }

    angular
        .module('app')
        .service('dashboardDataService', dashboardDataService);
})();