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

    class SignupBirthdayController {
        constructor($location, $cookieStore, $timeout) {
            const vm = this;

            vm.pageClass = 'signup-login blue';

            vm.pageNo = 5;
            $timeout(() => vm.pageNo++, 1000);

            (() => {
                const email = $cookieStore.get('signup.email');
                const password = $cookieStore.get('signup.password');
                const terms = $cookieStore.get('signup.terms');
                const reason = $cookieStore.get('signup.reason');
                const income = $cookieStore.get('signup.income');
                const timeline = $cookieStore.get('signup.timeline');
                if (!(email && password && terms && reason && income && timeline)) {
                    $location.path('/signup');
                }
            })();

            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n) || n === null;
            }

            function allConditionsSatisfied() {
                const month = isNumeric(vm.month) && vm.month > 0 && vm.month <= 12;
                const day = isNumeric(vm.day) && vm.day > 0 && vm.day <= 31;
                const year = isNumeric(vm.year) && vm.year > 1900 && vm.year < (new Date().getFullYear() - 18);
                return month && day && year;
            }

            vm.disableSubmitButton = () => {
                return !allConditionsSatisfied();
            };

            vm.submit = () => {
                if (allConditionsSatisfied()) {
                    $cookieStore.put('signup.birthday',`${vm.month}/${vm.day}/${vm.year}`);
                    $location.path('/signup/p2pPlatform');
                }
            };
        }

    }

    angular
        .module('app')
        .controller('SignupBirthdayController', SignupBirthdayController);
})();
