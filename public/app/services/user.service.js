/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 27/01/2016
*/

(function() {
    'use strict';

    class userService {
        constructor($http, notificationService) {
            this.$http = $http;
            this.notificationService = notificationService;
        }

        register(email, password, terms, reason, income, timeline, birthday, platform, accountId, firstName, lastName, apiKey, successCallback, errorCallback) {
            this.$http
                .post('/api/register', {
                    _id: email,
                    password: password,
                    terms: terms,
                    reason: reason,
                    income: income,
                    timeline: timeline,
                    birthday: birthday,
                    platform: platform,
                    accountId: accountId,
                    firstName: firstName,
                    lastName: lastName,
                    apiKey: apiKey
                })
                .then(successCallback, errorCallback);
        }

        login(email, password, successCallback) {
            this.$http
                .post('/api/login', { email: email, password: password })
                .then(successCallback, this.notificationService.apiError());
        }

        isEmailUsed(email, successCallback, errorCallback) {
            this.$http
                .get(`/api/user/${email}`)
                .then(successCallback, errorCallback);
        }

        userData(email, callback) {
            this.$http.get(`/api/user/infos/${email}`).then(callback, this.notificationService.apiError());
        }

        updatePassword(oldPassword, newPassword, callback) {
            this.$http.get(`/api/user/password`, { oldPassword: oldPassword, newPassword: newPassword }).then(callback, this.notificationService.apiError());
        }
    }

    angular
        .module('app')
        .service('userService', userService);
})();