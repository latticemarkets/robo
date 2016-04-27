/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
 * @author : bastienguerineau
 * Created on 29/03/2016
 */

(function() {
    'use strict';

    class ForgotPasswordController {
        constructor($location, userService) {
            const vm = this;

            function allConditionsSatisfied() {
                const emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
                return vm.email !== undefined && vm.email.length > 0 && emailRegex.test(vm.email);
            }

            vm.disableSubmitButton = () => {
                return !allConditionsSatisfied();
            };

            vm.submit = () => {
                if (allConditionsSatisfied()) {
                    userService.isEmailUsed(
                        vm.email,
                        response => {
                            if (response.data.ok) {
                                userService.sendEmail(vm.email);
                                // notification 5 sec + redirection
                            }
                            else {
                                $location.path('/signin');
                            }
                        }
                    );
                }
            };

        }
    }

    angular
        .module('app')
        .controller('ForgotPasswordController', ForgotPasswordController);
})();
