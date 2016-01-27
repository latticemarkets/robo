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
        .controller('SignupPersonalInfosController', SignupPersonalInfosController);

    SignupPersonalInfosController.$inject = ['$location', '$cookieStore', 'UserService'];

    function SignupPersonalInfosController($location, $cookieStore, UserService) {
        var vm = this;

        var email,
            password,
            terms,
            reason,
            income,
            timeline,
            birthday,
            platform,
            accountId,
            apiKey;

        vm.pageClass = 'signup-login blue';

        (function() {
            email = $cookieStore.get('signup.email');
            password = $cookieStore.get('signup.password');
            terms = $cookieStore.get('signup.terms');
            reason = $cookieStore.get('signup.reason');
            income = $cookieStore.get('signup.income');
            timeline = $cookieStore.get('signup.timeline');
            birthday = $cookieStore.get('signup.birthday');
            platform = $cookieStore.get('signup.platform');
            accountId = $cookieStore.get('signup.accountId');
            apiKey = $cookieStore.get('signup.apiKey');

            if (!(email && password && terms && reason && income && timeline && birthday && platform && accountId && apiKey)) {
                $location.path('/signup/p2pCredentials');
            }

            vm.platform = platform;
        })();

        function allConditionsSatisfied() { // TODO : build Regex to check API key and account ID
            return !!(vm.firstName !== undefined && vm.lastName !== undefined);
        }

        vm.disableSubmitButton = function() {
            return !allConditionsSatisfied();
        };

        vm.submit = function() {
            if (allConditionsSatisfied()) {
                UserService.register(email, password, terms, reason, income, timeline, birthday, platform, accountId, apiKey, vm.firstName, vm.lastName,
                    function(response) {
                        $cookieStore.put('token', response.data.token);
                        $location.path('/signup/registered');
                    },
                    function() { alert("Something went wrong ..."); }
                );
            }
        };
    }
})();