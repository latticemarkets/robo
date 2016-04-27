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

            const token = $routeParams.token;
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

            function allConditionsSatisfied() {
                return vm.charLengthGreaterThan8() && vm.hasLowercase() && vm.hasUppercase() && vm.hasSpecialChar();
            }

            vm.disableSubmitButton = () => {
                return !allConditionsSatisfied();
            };

            vm.submit = function() {
                if (allConditionsSatisfied()) {
                    if(vm.newPassword == vm.confirmPassword) {
                        console.log("good");
                        userService.reinitializePassword(token, vm.newPassword);
                        // callback if the reinitialization has been correctly done
                   }
                    else{
                        console.log("not good");
                    }
                }
            };

        }
    }

    angular
        .module('app')
        .controller('ReinitializePasswordController', ReinitializePasswordController);
})();
