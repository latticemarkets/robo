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

    class SignupYearlyIncomeController {
        constructor($location, $cookies, $timeout) {
            const vm = this;

            vm.pageClass = 'signup-login blue';

            vm.pageNo = 3;
            $timeout(() => vm.pageNo++, 1000);

            vm.incomeRanges = {
                '-25': 'Less than $25,000',
                '25-50': '$25,000 - $50,000',
                '50-100': '$50,000 - $100,000',
                '100-250': '$100,000 - $250,000',
                '+250': '$250,000+'
            };

            (() => {
                const email = $cookies.get('signup.email');
                const password = $cookies.get('signup.password');
                const terms = $cookies.get('signup.terms');
                const reason = $cookies.get('signup.reason');

                if (!(email && password && terms && reason)) {
                    $location.path('/signup');
                }
            })();

            vm.submit = income => {
                if (Object.keys(vm.incomeRanges).indexOf(income) >= 0) {
                    $cookies.put('signup.income', income);
                    $location.path('/signup/timeline');
                }
            };
        }
    }

    angular
        .module('app')
        .controller('SignupYearlyIncomeController', SignupYearlyIncomeController);
})();
