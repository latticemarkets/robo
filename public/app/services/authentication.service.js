/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 30/01/2016
*/

(() => {
    'use strict';

    class authenticationService {
        constructor($cookieStore, $rootScope, $http) {
            this.$cookieStore = $cookieStore;
            this.$rootScope = $rootScope;
            this.$http = $http;
        }

        authenticate(token, email) {
            this.$rootScope.globals.currentUser = {
                email: email,
                token: token
            };
            this.$cookieStore.put('globals', this.$rootScope.globals);
            this.$http.defaults.headers.common['X-TOKEN'] = this.$rootScope.globals.currentUser.token; // jshint ignore:line
            this.$http.defaults.headers.common['USER'] = this.$rootScope.globals.currentUser.email; // jshint ignore:line
        }

        logout() {
            this.$rootScope.globals = {};
            this.$http.defaults.headers.common['X-TOKEN'] = ""; // jshint ignore:line
            this.$http.defaults.headers.common['USER'] = ""; // jshint ignore:line
            this.$cookieStore.remove('globals');
        }
    }

    angular
        .module('app')
        .service('authenticationService', authenticationService);
})();