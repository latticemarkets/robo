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
        constructor($location, $cookies, userService, notificationService, authenticationService, $timeout) {
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
                email = $cookies.get('signup.email');
                password = $cookies.get('signup.password');
                terms = $cookies.get('signup.terms');
                reason = $cookies.get('signup.reason');
                income = $cookies.get('signup.income');
                timeline = $cookies.get('signup.timeline');
                birthday = $cookies.get('signup.birthday');
                platforms = $cookies.getObject('signup.platforms');

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
                            $cookies.put('guidedTour', true);
                            $cookies.remove('signup.email');
                            $cookies.remove('signup.password');
                            $cookies.remove('signup.terms');
                            $cookies.remove('signup.reason');
                            $cookies.remove('signup.income');
                            $cookies.remove('signup.timeline');
                            $cookies.remove('signup.birthday');
                            $cookies.remove('signup.originator');
                            $cookies.remove('signup.platforms');
                            $cookies.remove('signup.extension');
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
