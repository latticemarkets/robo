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

    class UserAccountController {
        constructor(userService, authenticationService, cssInjector) {
            var vm = this;
            cssInjector.add("assets/stylesheets/homer_style.css");
            const userId = authenticationService.getCurrentUsersEmail();

            vm.userPromise = userService.userData(userId);
        }
    }

    angular
        .module('app')
        .controller('UserAccountController', UserAccountController);
})();
