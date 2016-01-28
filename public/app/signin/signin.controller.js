/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 28/01/2016
*/

(function() {
    'use strict';

    class SignInController {
        constructor(UserService, $cookieStore, $location, NotificationService) {
            const vm = this;

            function allConditionsSatisfied() {
                const emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
                const email = vm.email !== undefined && vm.email.length > 0 && emailRegex.test(vm.email);

                const password = vm.password !== undefined && vm.password.length > 0;
                return email && password;
            }

            vm.disableSubmitButton = () => {
                return !allConditionsSatisfied();
            };

            vm.submit = () => {
                if (allConditionsSatisfied()) {
                    UserService.login(vm.email, vm.password,
                    response => {
                        $cookieStore.put('token', response.data.token);
                        $location.path('/dashboard');
                    },
                    response => {
                        NotificationService.error(response.data);
                    });
                }
            };
        }
    }

    angular
        .module('app')
        .controller('SignInController', SignInController);
})();