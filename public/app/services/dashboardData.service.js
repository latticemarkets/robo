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
        constructor($http, notificationService) {
            this.$http = $http;
            this.notificationService = notificationService;
        }

        availableCapital(callback) {
            return this.$http.get('/api/dashboard/capital/available').then(callback, this.notificationService.apiError());
        }

        allocatedCapital(callback) {
            return this.$http.get('/api/dashboard/capital/allocated').then(callback, this.notificationService.apiError());
        }

        averageMaturity(callback) {
            return this.$http.get('/api/dashboard/averageMaturity').then(callback, this.notificationService.apiError());
        }

        averageIntRate(callback) {
            return this.$http.get('/api/dashboard/averageIntRate').then(callback, this.notificationService.apiError());
        }

        expectedReturns(callback) {
            return this.$http.get('/api/dashboard/expectedReturns').then(callback, this.notificationService.apiError());
        }

        lastLoanMaturity(callback) {
            return this.$http.get('/api/dashboard/lastLoanMaturity').then(callback, this.notificationService.apiError());
        }

        currentRoiRate(callback) {
            return this.$http.get('/api/dashboard/currentRoiRate').then(callback, this.notificationService.apiError());
        }

        expectedRoiRate(callback) {
            return this.$http.get('/api/dashboard/expectedRoiRate').then(callback, this.notificationService.apiError());
        }
    }

    angular
        .module('app')
        .service('dashboardDataService', dashboardDataService);
})();