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

    changePassword.$inject = ['patternCheckerService', 'notificationService', 'userService'];

    function changePassword(patternCheckerService, notificationService, userService) {
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

                scope.disableSubmitButton = () => !(scope.oldPassword && allConditionsSatisfied());

                scope.submit = () => {
                    if (allConditionsSatisfied()) {
                        userService.updatePassword(
                            scope.oldPassword,
                            scope.newPassword,
                            () => {
                                scope.oldPassword = null;
                                scope.newPassword = null;
                                notificationService.success('Password changed');
                            }
                        );
                    }
                };
            }
        };
    }
})();
