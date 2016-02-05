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

    class SignupReasonInvestmentController {
        constructor($location, $cookieStore, $timeout) {
            const vm = this;

            vm.pageClass = 'signup-login blue';

            vm.pageNo = 2;
            $timeout(() => vm.pageNo++, 1000);

            vm.reasons = {
                longterm: 'Long-term investment',
                shortterm: 'Short-term investment',
                majorpurchase: 'Major purchase',
                children: 'Children',
                general: 'General'
            };

            (() => {
                const email = $cookieStore.get('signup.email');
                const password = $cookieStore.get('signup.password');
                const terms = $cookieStore.get('signup.terms');
                if (!(email && password && terms)) {
                    $location.path('/signup');
                }
            })();

            vm.submit = reason => {
                if (Object.keys(vm.reasons).indexOf(reason) >= 0) {
                    $cookieStore.put('signup.reason', reason);
                    $location.path('/signup/yearlyIncome');
                }
            };
        }
    }

    angular
        .module('app')
        .controller('SignupReasonInvestmentController', SignupReasonInvestmentController);
})();
