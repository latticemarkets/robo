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
        constructor($location, $cookies, $timeout, constantsService) {
            const vm = this;

            const platforms = $cookies.getObject('signup.platforms');

            if (platforms) {
                vm.pageNo = 8;
            }
            else {
                vm.pageNo = 6;
                $timeout(() => vm.pageNo++, 1000);
            }

            vm.pageClass = 'signup-login blue';

            vm.platforms = constantsService.platformsImgExtensions;

            (() => {
                const email = $cookies.get('signup.email');
                const password = $cookies.get('signup.password');
                const terms = $cookies.get('signup.terms');
                const reason = $cookies.get('signup.reason');
                const income = $cookies.get('signup.income');
                const timeline = $cookies.get('signup.timeline');
                const birthday = $cookies.get('signup.birthday');

                if (!(email && password && terms && reason && income && timeline && birthday)) {
                    $location.path('/signup');
                }
            })();

            vm.submit = platform => {
                if (Object.keys(vm.platforms).indexOf(platform) >= 0 && !vm.alreadyAdded(platform)) {
                    $cookies.put('signup.originator', platform);
                    $cookies.put('signup.extension', vm.platforms[platform]);
                    $location.path('/signup/p2pCredentials');
                }
            };

            vm.alreadyAdded = platformName => {
                if (platforms) {
                    return platforms.some(addedPlatform => addedPlatform.originator == platformName);
                }
                return false;
            };

            vm.someAlreadyAdded = () => Object.keys(vm.platforms).some(platform => vm.alreadyAdded(platform));

            vm.skip = () => {
                $cookies.putObject('signup.platforms', platforms);
                $location.path('/signup/personalInfos');
            };
        }
    }

    angular
        .module('app')
        .controller('SignupP2pPlatformController', SignupP2pPlatformController);
})();
