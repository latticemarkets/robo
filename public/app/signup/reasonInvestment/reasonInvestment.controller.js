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
        .controller('SignupReasonInvestmentController', SignupReasonInvestmentController);

    SignupReasonInvestmentController.$inject = ['$location', '$cookieStore'];

    function SignupReasonInvestmentController($location, $cookieStore) {
        var vm = this;

        vm.pageClass = 'signup-login blue';

        (function() {
            var email = $cookieStore.get('signup.email');
            var password = $cookieStore.get('signup.password');
            var terms = $cookieStore.get('signup.terms');
            if (!(email && password && terms)) {
                $location.path('/signup/termsAndConditions');
            }
        })();

        vm.submit = function(reason) {
            $cookieStore.put('signup.reason', reason);
            $location.path('/signup/yearlyIncome');
        };
    }
})();