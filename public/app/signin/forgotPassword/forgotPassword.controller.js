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
        constructor($location, userService, patternCheckerService, notificationService, $timeout) {
            const vm = this;

            function allConditionsSatisfied() {
                return patternCheckerService.isEmail(vm.email);
            }

            vm.disableSubmitButton = () => {
                return !allConditionsSatisfied();
            };

            vm.submit = () => {
                if (allConditionsSatisfied()) {
                    userService.sendEmail(vm.email);
                    notificationService.success("An email has been sent, containing a link to reinitialize your password.");
                    $timeout(() => $location.path('/signin'), 500);
                }
            };

        }
    }

    angular
        .module('app')
        .controller('ForgotPasswordController', ForgotPasswordController);
})();
