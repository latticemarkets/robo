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
        constructor($location, $cookieStore, userService, notificationService) {
            const vm = this;

            vm.pageClass = 'signup-login blue';

            vm.emailPattern = () => {
                const regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
                return regex.test(vm.email);
            };
            vm.passwordPattern = {
                charLength() {
                    if (vm.password) {
                        return vm.password.length >= 8;
                    }
                },
                lowercase() {
                    const regex = /^(?=.*[a-z]).+$/;
                    return regex.test(vm.password) && vm.password !== undefined;
                },
                uppercase() {
                    const regex = /^(?=.*[A-Z]).+$/;
                    return regex.test(vm.password);
                },
                special() {
                    const regex = /^(?=.*[0-9_\W]).+$/;
                    return regex.test(vm.password);
                }
            };

            vm.tickBox = function(condition) {
                return condition() ? 'glyphicon-ok' : 'glyphicon-remove';
            };

            function allConditionsSatisfied() {
                const email = vm.emailPattern();
                const charLength = vm.passwordPattern.charLength();
                const lowercase = vm.passwordPattern.lowercase();
                const uppercase = vm.passwordPattern.uppercase();
                const special = vm.passwordPattern.special();
                return email && charLength && lowercase && uppercase && special;
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
                                $cookieStore.put('signup.email', vm.email);
                                $cookieStore.put('signup.password', vm.password);
                                $location.path('/signup/termsAndConditions');
                            }
                            else {
                                displayError();
                            }
                        },
                        () => { displayError(); }
                    );
                }
            };

            function displayError() {
                notificationService.error("This email is already used.");
            }
        }
    }

    angular
        .module('app')
        .controller('SignupLoginController', SignupLoginController);

})();