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

    changePassword.$inject = [];

    function changePassword() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
            },
            templateUrl: '/assets/app/userAccount/changePassword/changePassword.html',
            controller: 'ChangePasswordController'
        };
    }
})();
