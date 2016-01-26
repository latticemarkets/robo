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
        .controller('SignupTimelineController', SignupTimelineController);

    SignupTimelineController.$inject = ['$location', '$cookieStore'];

    function SignupTimelineController($location, $cookieStore) {
        var vm = this;

        (function() {
            var email = $cookieStore.get('signup.email');
            var password = $cookieStore.get('signup.password');
            var terms = $cookieStore.get('signup.terms');
            var reason = $cookieStore.get('signup.reason');
            var income = $cookieStore.get('signup.income');
            if (!(email && password && terms && reason && income)) {
                $location.path('/signup/yearlyIncome');
            }
        })();

        vm.submit = function(timeline) {
            $cookieStore.put('signup.timeline', timeline);
            $location.path('/signup/birthday');
        };
    }
})();