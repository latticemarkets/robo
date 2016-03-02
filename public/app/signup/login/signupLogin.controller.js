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

    class SignupLoginController {
        constructor($location, $cookies, userService, notificationService, patternCheckerService) {
            const vm = this;

            vm.pageClass = 'signup-login blue';


            vm.tickBox = function(condition) {
                return condition() ? 'glyphicon-ok' : 'glyphicon-remove';
            };

            vm.isEmail = () => patternCheckerService.isEmail(vm.email);
            vm.charLengthGreaterThan8 = () => patternCheckerService.charLengthGreaterThan8(vm.password);
            vm.hasLowercase = () => patternCheckerService.hasLowercase(vm.password);
            vm.hasUppercase = () => patternCheckerService.hasUppercase(vm.password);
            vm.hasSpecialChar = () => patternCheckerService.hasSpecialChar(vm.password);

            function allConditionsSatisfied() {
                return vm.isEmail() && vm.charLengthGreaterThan8() && vm.hasLowercase() && vm.hasUppercase() && vm.hasSpecialChar();
            }

            vm.disableSubmitButton = () => {
                return !allConditionsSatisfied();
            };

            vm.submit = function() {
                if (allConditionsSatisfied()) {
                    userService.isEmailUsed(
                        vm.email,
                        response => {
                            if (response.data.ok) {
                                $cookies.put('signup.email', vm.email);
                                $cookies.put('signup.password', vm.password);
                                $location.path('/signup/termsAndConditions');
                            }
                            else {
                                notificationService.error("This email is already used.");
                            }
                        },
                        notificationService.apiError()
                    );
                }
            };
        }
    }

    angular
        .module('app')
        .controller('SignupLoginController', SignupLoginController);

})();
