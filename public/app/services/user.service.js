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
        constructor($http, notificationService, $window) {
            this.$http = $http;
            this.notificationService = notificationService;
            this.$window = $window;
        }

        register(email, password, terms, reason, income, timeline, birthday, platforms, firstName, lastName, successCallback, errorCallback) {
            this.$http
                .post('/api/register', angular.toJson({
                    email: email,
                    password: password,
                    terms: terms,
                    reason: reason,
                    income: income,
                    timeline: timeline,
                    birthday: birthday,
                    platforms: platforms,
                    firstName: firstName.toLowerCase(),
                    lastName: lastName.toLowerCase()
                }))
                .then(successCallback, errorCallback);
        }

        login(email, password, successCallback) {
            this.$http
                .post('/api/login', { email: email, password: password })
                .then(successCallback, this.notificationService.apiError());
        }

        isEmailUsed(email, successCallback, errorCallback) {
            this.$http
                .get(`/api/user/check/${email}`)
                .then(successCallback, errorCallback);
        }

        userData(callback) {
            const promise = this.$http.get('/api/user/infos');
            promise.then(callback, this.notificationService.apiError());
            return promise;
        }

        updatePassword(oldPassword, newPassword, callback) {
            this.$http.put('/api/user/password', { oldPassword: oldPassword, newPassword: newPassword }).then(callback, this.notificationService.apiError());
        }

        sendEmail(email, callback){
            this.$http.post('/api/sendEmail', {email: email}).then(callback, this.notificationService.apiError());
        }

        reinitializePassword(tokenForgotPassword, newPassword, callback) {
            this.$http.post('/api/user/reinitializePassword', {tokenForgotPassword: tokenForgotPassword, newPassword: newPassword }).then(callback, this.notificationService.apiError());
        }

        updatePersonalData(firstName, lastName, birthday, callback) {
            this.$http.put('/api/user/personalData', { firstName: firstName.toLowerCase(), lastName: lastName.toLowerCase(), birthday: birthday }).then(callback, this.notificationService.apiError());
        }

        destroyUser(password, callback) {
            this.$http.post('/api/user/destroy', { password: password }).then(callback, this.notificationService.apiError());
        }

        checkUserToken(email, token, callback) {
            this.$http.post('/api/user/token', { email: email, token: token }).then(callback, () => this.$window.location.href = '/');
        }
        
        checkConfirmEmailToken(token, okCallback, errorCallback) {
            this.$http.post('/api/user/confirmEmail', { token: token }).then(okCallback, errorCallback);
        }
    }

    angular
        .module('app')
        .service('userService', userService);
})();
