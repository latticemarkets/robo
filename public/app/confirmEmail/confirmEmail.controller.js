/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
 * @author : julienderay
 * Created on 04/05/2016
 */

(function() {
    'use strict';

    class ConfirmEmailController {
        constructor($routeParams, $location, $timeout, userService) {
            const vm = this;
            vm.notConfirmed = true;

            (() => {
                const token = $routeParams.token.split('?')[1];
                if (token === undefined || token.length === 0) {
                    $location.path('/404');
                }
                
                userService.checkConfirmEmailToken(
                    token,
                    () => {
                        vm.notConfirmed = false;
                        $timeout(() => $location.path('/signin'), 3000);
                    },
                    () => $location.path('/404')
                );
            })();
        }
    }

    angular
        .module('app')
        .controller('ConfirmEmailController', ConfirmEmailController);
})();
