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

    class SignupTimelineController {
        constructor($location, $cookieStore, $timeout) {
            const vm = this;

            vm.pageClass = 'signup-login blue';

            vm.pageNo = 4;
            $timeout(() => vm.pageNo++, 1000);

            vm.timelines = {
                '-5': 'Less than 5 years',
                '5-10': '5 - 10 years',
                '10-15': '10 - 15 years',
                '15-25': '15 - 25 years',
                '+25': '25+ years'
            };

            (() => {
                const email = $cookieStore.get('signup.email');
                const password = $cookieStore.get('signup.password');
                const terms = $cookieStore.get('signup.terms');
                const reason = $cookieStore.get('signup.reason');
                const income = $cookieStore.get('signup.income');

                if (!(email && password && terms && reason && income)) {
                    $location.path('/signup');
                }
            })();

            vm.submit = timeline => {
                if (Object.keys(vm.timelines).indexOf(timeline) >= 0) {
                    $cookieStore.put('signup.timeline', timeline);
                    $location.path('/signup/birthday');
                }
            };
        }
    }

    angular
        .module('app')
        .controller('SignupTimelineController', SignupTimelineController);
})();
