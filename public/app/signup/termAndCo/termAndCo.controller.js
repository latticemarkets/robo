/**
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
        .controller('SignupTermAndCoController', SignupTermAndCoController);

    SignupTermAndCoController.$inject = ['$location', '$cookieStore'];

    function SignupTermAndCoController($location, $cookieStore) {
        var vm = this;

        vm.pageClass = 'signup-login blue';

        (function() {
            var email = $cookieStore.get('signup.email');
            var password = $cookieStore.get('signup.password');

            if (!(email && password)) {
                goBackToLoginRegistration();
            }
        })();

        vm.cancel = function() {
            goBackToLoginRegistration();
        };

        vm.submit = function() {
            $cookieStore.put('signup.terms', 'true');
            $location.path('/signup/reasonInvestment');
        };

        function goBackToLoginRegistration() {
            $location.path('/signup');
        }
    }
})();