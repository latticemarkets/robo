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
        constructor(patternCheckerService) {
            const vm = this;

            vm.tickBox = function(condition) {
                return condition() ? 'glyphicon-ok' : 'glyphicon-remove';
            };

            vm.charLengthGreaterThan8 = () => patternCheckerService.charLengthGreaterThan8(vm.password);
            vm.hasLowercase = () => patternCheckerService.hasLowercase(vm.password);
            vm.hasUppercase = () => patternCheckerService.hasUppercase(vm.password);
            vm.hasSpecialChar = () => patternCheckerService.hasSpecialChar(vm.password);

            function allConditionsSatisfied() {
                return vm.charLengthGreaterThan8() && vm.hasLowercase() && vm.hasUppercase() && vm.hasSpecialChar();
            }

            vm.disableSubmitButton = () => {
                return !allConditionsSatisfied();
            };

            vm.submit = function() {
                if (allConditionsSatisfied()) {
                    if(vm.password == vm.confirmPassword) {
                        console.log("good");
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