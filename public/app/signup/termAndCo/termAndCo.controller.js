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

    class SignupTermAndCoController {
        constructor($location, $cookieStore) {
            const vm = this;

            vm.pageClass = 'signup-login blue';

            (() => {
                const email = $cookieStore.get('signup.email');
                const password = $cookieStore.get('signup.password');

                if (!(email && password)) {
                    goBackToLoginRegistration();
                }
            })();

            vm.cancel = () => {
                goBackToLoginRegistration();
            };

            vm.submit = () => {
                $cookieStore.put('signup.terms', 'true');
                $location.path('/signup/reasonInvestment');
            };

            function goBackToLoginRegistration() {
                $location.path('/signup');
            }
        }
    }

    angular
        .module('app')
        .controller('SignupTermAndCoController', SignupTermAndCoController);
})();