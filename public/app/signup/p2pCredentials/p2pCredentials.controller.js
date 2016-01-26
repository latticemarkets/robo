/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 26/01/2016
*/

(function() {
    'use strict';

    angular
        .module('app')
        .controller('SignupP2pCredentialsController', SignupP2pCredentialsController);

    SignupP2pCredentialsController.$inject = ['$cookieStore', '$location'];

    function SignupP2pCredentialsController($cookieStore, $location) {
        var vm = this;

        (function() {
            var email = $cookieStore.get('signup.email');
            var password = $cookieStore.get('signup.password');
            var terms = $cookieStore.get('signup.terms');
            var reason = $cookieStore.get('signup.reason');
            var income = $cookieStore.get('signup.income');
            var timeline = $cookieStore.get('signup.timeline');
            var dirthday = $cookieStore.get('signup.birthday');
            var platform = $cookieStore.get('signup.platform');

            if (!(email && password && terms && reason && income && timeline && dirthday && platform)) {
                $location.path('/signup/p2pPlatform');
            }

            vm.platform = platform;
        })();

        function allConditionsSatisfied() { // TODO : build Regex to check API key and account ID
            return true;
        }

        vm.disableSubmitButton = function() {
            return !allConditionsSatisfied();
        };

        vm.submit = function() {
            if (allConditionsSatisfied()) {
                $cookieStore.put('signup.accountID', vm.accountId);
                $cookieStore.put('signup.apiKey', vm.apiKey);
                $location.path('/signup/personalInfos');
            }
        };
    }
})();