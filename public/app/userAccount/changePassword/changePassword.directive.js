/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 05/02/2016
*/

(() => {
    'use strict';

    angular
        .module('app')
        .directive('changePassword', changePassword);

    changePassword.$inject = ['patternCheckerService', 'notificationService'];

    function changePassword(patternCheckerService, notificationService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
            },
            templateUrl: '/assets/app/userAccount/changePassword/changePassword.html',
            link(scope) {
                scope.tickBox = function(condition) {
                    return condition() ? 'glyphicon-ok' : 'glyphicon-remove';
                };

                scope.charLengthGreaterThan8 = () => patternCheckerService.charLengthGreaterThan8(scope.newPassword);
                scope.hasLowercase = () => patternCheckerService.hasLowercase(scope.newPassword);
                scope.hasUppercase = () => patternCheckerService.hasUppercase(scope.newPassword);
                scope.hasSpecialChar = () => patternCheckerService.hasSpecialChar(scope.newPassword);

                function allConditionsSatisfied() {
                    return scope.charLengthGreaterThan8() && scope.hasLowercase() && scope.hasUppercase() && scope.hasSpecialChar();
                }

                scope.disableSubmitButton = () => !allConditionsSatisfied();

                scope.submit = () => {
                    if (allConditionsSatisfied()) {
                        scope.spinner = true;
                        userService.updatePassword(
                            scope.oldPassword,
                            scope.newPassword,
                            response => {
                                if (response.data.ok) {
                                    scope.spinner = false;
                                    notificationService.success('Password changed');
                                }
                                else {
                                    notificationService.error('Incorrect old password');
                                }
                            }
                        );
                    }
                };
            }
        };
    }
})();
