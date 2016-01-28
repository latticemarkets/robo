/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 26/01/2016
*/

(function() {
    'use strict';

    class SignupP2pPlatformController {
        constructor($location, $cookieStore) {
            const vm = this;

            vm.pageClass = 'signup-login blue';

            (() => {
                const email = $cookieStore.get('signup.email');
                const password = $cookieStore.get('signup.password');
                const terms = $cookieStore.get('signup.terms');
                const reason = $cookieStore.get('signup.reason');
                const income = $cookieStore.get('signup.income');
                const timeline = $cookieStore.get('signup.timeline');
                const birthday = $cookieStore.get('signup.birthday');

                if (!(email && password && terms && reason && income && timeline && birthday)) {
                    $location.path('/signup');
                }
            })();

            vm.submit = platform => {
                const split = platform.split('.');
                $cookieStore.put('signup.platform', split[0]);
                $cookieStore.put('signup.extension', split[1]);
                $location.path('/signup/p2pCredentials');
            };
        }
    }

    angular
        .module('app')
        .controller('SignupP2pPlatformController', SignupP2pPlatformController);
})();