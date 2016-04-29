/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
 * @author : bastienguerineau
 * Created on 31/03/2016
 */

(function() {
    'use strict';

    class ReinitializePasswordController {
        constructor(patternCheckerService, userService, $routeParams) {
            const vm = this;

            const token = $routeParams.token.split('?')[1];
            // todo :
            // if the token doesn't exist : redirect
            // if the token exist : check it exists in the db

            vm.tickBox = function(condition) {
                return condition() ? 'glyphicon-ok' : 'glyphicon-remove';
            };

            vm.charLengthGreaterThan8 = () => patternCheckerService.charLengthGreaterThan8(vm.newPassword);
            vm.hasLowercase = () => patternCheckerService.hasLowercase(vm.newPassword);
            vm.hasUppercase = () => patternCheckerService.hasUppercase(vm.newPassword);
            vm.hasSpecialChar = () => patternCheckerService.hasSpecialChar(vm.newPassword);
            vm.passwordsMatch = () => vm.newPassword === vm.confirmPassword;

            function allConditionsSatisfied() {
                return vm.charLengthGreaterThan8() && vm.hasLowercase() && vm.hasUppercase() && vm.hasSpecialChar() && vm.passwordsMatch();
            }

            vm.disableSubmitButton = () => {
                return !allConditionsSatisfied();
            };

            vm.submit = function() {
                if (allConditionsSatisfied()) {
                    userService.reinitializePassword(token, vm.newPassword);
                }
            };

        }
    }

    angular
        .module('app')
        .controller('ReinitializePasswordController', ReinitializePasswordController);
})();
