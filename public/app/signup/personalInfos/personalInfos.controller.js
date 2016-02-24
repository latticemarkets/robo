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

    class SignupPersonalInfosController {
        constructor($location, $cookieStore, userService, notificationService, authenticationService, $timeout) {
            const vm = this;

            let email,
                password,
                terms,
                reason,
                income,
                timeline,
                birthday,
                platforms;

            vm.pageClass = 'signup-login blue';

            vm.pageNo = 8;
            $timeout(() => vm.pageNo++, 1000);

            (() => {
                email = $cookieStore.get('signup.email');
                password = $cookieStore.get('signup.password');
                terms = $cookieStore.get('signup.terms');
                reason = $cookieStore.get('signup.reason');
                income = $cookieStore.get('signup.income');
                timeline = $cookieStore.get('signup.timeline');
                birthday = $cookieStore.get('signup.birthday');
                platforms = $cookieStore.get('signup.platforms');

                if (!(email && password && terms && reason && income && timeline && birthday && platforms)) {
                    $location.path('/signup');
                }
            })();

            function allConditionsSatisfied() { // TODO : build Regex to check API key and account ID
                return !!(vm.firstName !== undefined && vm.lastName !== undefined);
            }

            vm.disableSubmitButton = () => {
                return !allConditionsSatisfied();
            };

            vm.submit = () => {
                if (allConditionsSatisfied()) {
                    userService.register(email, password, terms, reason, income, timeline, birthday, platforms, vm.firstName, vm.lastName,
                        response => {
                            authenticationService.authenticate(response.data.token, email);
                            $cookieStore.put('guidedTour', true);
                            $cookieStore.remove('signup.email');
                            $cookieStore.remove('signup.password');
                            $cookieStore.remove('signup.terms');
                            $cookieStore.remove('signup.reason');
                            $cookieStore.remove('signup.income');
                            $cookieStore.remove('signup.timeline');
                            $cookieStore.remove('signup.birthday');
                            $cookieStore.remove('signup.originator');
                            $cookieStore.remove('signup.platforms');
                            $location.path('/signup/registered');
                        },
                        response => {
                            notificationService.error(response.data);
                        }
                    );
                }
            };
        }
    }

    angular
        .module('app')
        .controller('SignupPersonalInfosController', SignupPersonalInfosController);
})();
