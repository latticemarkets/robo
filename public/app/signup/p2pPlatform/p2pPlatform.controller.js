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

    angular
        .module('app')
        .controller('SignupP2pPlatformController', SignupP2pPlatformController);

    SignupP2pPlatformController.$inject = ['$location', '$cookieStore'];

    function SignupP2pPlatformController($location, $cookieStore) {
        var vm = this;

        (function() {
            var email = $cookieStore.get('signup.email');
            var password = $cookieStore.get('signup.password');
            var terms = $cookieStore.get('signup.terms');
            var reason = $cookieStore.get('signup.reason');
            var income = $cookieStore.get('signup.income');
            var timeline = $cookieStore.get('signup.timeline');
            var dirthday = $cookieStore.get('signup.birthday');

            if (!(email && password && terms && reason && income && timeline && dirthday)) {
                $location.path('/signup/birthday');
            }
        })();

        vm.submit = function(platform) {
            $cookieStore.put('signup.platform', platform);
            $location.path('/signup/p2pCredentials');
        };
    }
})();