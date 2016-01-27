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
        .controller('SignupBirthdayController', SignupBirthdayController);

    SignupBirthdayController.$inject = ['$location', '$cookieStore'];

    function SignupBirthdayController($location, $cookieStore) {
        var vm = this;

        vm.pageClass = 'signup-login blue';

        (function() {
            var email = $cookieStore.get('signup.email');
            var password = $cookieStore.get('signup.password');
            var terms = $cookieStore.get('signup.terms');
            var reason = $cookieStore.get('signup.reason');
            var income = $cookieStore.get('signup.income');
            var timeline = $cookieStore.get('signup.timeline');
            if (!(email && password && terms && reason && income && timeline)) {
                $location.path('/signup/timeline');
            }
        })();

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n) || n === null;
        }

        function allConditionsSatisfied() {
            var month = isNumeric(vm.month) && vm.month > 0 && vm.month <= 12;
            var day = isNumeric(vm.day) && vm.day > 0 && vm.day <= 31;
            var year = isNumeric(vm.year) && vm.year > 1900 && vm.year < (new Date().getFullYear() - 18);
            return month && day && year;
        }

        vm.disableSubmitButton = function() {
            return !allConditionsSatisfied();
        };

        vm.submit = function() {
            if (allConditionsSatisfied()) {
                $cookieStore.put('signup.birthday', new Date(vm.month + '/' + vm.day + '/' + vm.year).toLocaleDateString());
                $location.path('/signup/p2pPlatform');
            }
        };
    }
})();