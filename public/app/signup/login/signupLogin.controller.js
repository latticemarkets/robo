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
        .controller('SignupLoginController', SignupLoginController);

    SignupLoginController.$inject = ['$location', '$cookieStore'];

    function SignupLoginController($location, $cookieStore) {
        var vm = this;

        vm.pageClass = 'signup-login blue';

        vm.emailPattern = function() {
            var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
            return regex.test(vm.email);
        };
        vm.passwordPattern = {
            charLength: function() {
                if (vm.password) {
                    return vm.password.length >= 8;
                }
            },
            lowercase: function() {
                var regex = /^(?=.*[a-z]).+$/;
                return regex.test(vm.password);
            },
            uppercase: function() {
                var regex = /^(?=.*[A-Z]).+$/;
                return regex.test(vm.password);
            },
            special: function() {
                var regex = /^(?=.*[0-9_\W]).+$/;
                return regex.test(vm.password);
            }
        };

        vm.tickBox = function(condition) {
            return condition() ? 'glyphicon-ok' : 'glyphicon-remove';
        };

        function allConditionsSatisfied() {
            var email = vm.emailPattern();
            var charLength = vm.passwordPattern.charLength();
            var lowercase = vm.passwordPattern.lowercase();
            var uppercase = vm.passwordPattern.uppercase();
            var special = vm.passwordPattern.special();
            return email && charLength && lowercase && uppercase && special;
        }

        vm.disableSubmitButton = function() {
            return !allConditionsSatisfied();
        };

        vm.submit = function() {
            if (allConditionsSatisfied()) {
                $cookieStore.put('signup.email', vm.email);
                $cookieStore.put('signup.password', vm.password);
                $location.path('signup/termsAndConditions');
            }
        };
    }
})();