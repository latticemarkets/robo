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
        constructor($location, userService, patternCheckerService) {
            const vm = this;

            function allConditionsSatisfied() {
                return patternCheckerService.isEmail(vm.email);
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
