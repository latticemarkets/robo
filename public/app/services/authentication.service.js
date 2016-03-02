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
        constructor($cookies, $rootScope, $http) {
            this.$cookies = $cookies;
            this.$rootScope = $rootScope;
            this.$http = $http;
        }

        authenticate(token, email) {
            this.$rootScope.globals.currentUser = {
                email: email,
                token: token
            };
            this.$cookies.putObject('globals', this.$rootScope.globals);
            this.$http.defaults.headers.common['X-TOKEN'] = this.$rootScope.globals.currentUser.token; // jshint ignore:line
            this.$http.defaults.headers.common['USER'] = this.$rootScope.globals.currentUser.email; // jshint ignore:line
            this.$cookies.put('connected', true);
        }

        logout() {
            this.$rootScope.globals = {};
            this.$http.defaults.headers.common['X-TOKEN'] = ""; // jshint ignore:line
            this.$http.defaults.headers.common['USER'] = ""; // jshint ignore:line
            this.$cookies.remove('globals');
            this.$cookies.remove('connected');
        }

        getCurrentUsersEmail() {
            if (this.$rootScope.globals) {
                if (this.$rootScope.globals.currentUser) {
                    const email = this.$rootScope.globals.currentUser.email;
                    return email ? this.$rootScope.globals.currentUser.email : undefined;
                }
                else {
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        }

        getCurrentUsersToken() {
            if (this.$rootScope.globals) {
                if (this.$rootScope.globals.currentUser) {
                    const email = this.$rootScope.globals.currentUser.token;
                    return email ? this.$rootScope.globals.currentUser.token : undefined;
                }
                else {
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        }
    }

    angular
        .module('app')
        .service('authenticationService', authenticationService);
})();