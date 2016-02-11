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

    class SignupP2pCredentialsController {
        constructor($cookieStore, $location, $timeout) {
            const vm = this;

            vm.pageClass = 'signup-login blue';

            vm.pageNo = 7;
            $timeout(() => vm.pageNo++, 1000);

            (() => {
                const email = $cookieStore.get('signup.email');
                const password = $cookieStore.get('signup.password');
                const terms = $cookieStore.get('signup.terms');
                const reason = $cookieStore.get('signup.reason');
                const income = $cookieStore.get('signup.income');
                const timeline = $cookieStore.get('signup.timeline');
                const birthday = $cookieStore.get('signup.birthday');
                const platform = $cookieStore.get('signup.platform');
                const extension = $cookieStore.get('signup.extension');

                if (!(email && password && terms && reason && income && timeline && birthday && platform)) {
                    $location.path('/signup');
                }

                vm.platform = platform;
                vm.extension = extension;
            })();

            function allConditionsSatisfied() { // TODO : build Regex to check API key and account ID
                return !!(vm.accountId !== undefined && vm.apiKey !== undefined);
            }

            vm.disableSubmitButton = () => {
                return !allConditionsSatisfied();
            };

            vm.submit = () => {
                submit('/signup/personalInfos');
            };

            vm.add = () => {
                submit('/signup/p2pPlatform');
            };

            function submit(uri) {
                if (allConditionsSatisfied()) {
                    const platform = {name: vm.platform, apiKey: vm.apiKey, accountId: vm.accountId};
                    const platforms = $cookieStore.get('signup.platforms');

                    if (platforms) {
                        platforms.push(platform);
                        $cookieStore.put('signup.platforms', platforms);
                    }
                    else {
                        $cookieStore.put('signup.platforms', [platform]);
                    }

                    $location.path(uri);
                }
            }
        }
    }

    angular
        .module('app')
        .controller('SignupP2pCredentialsController', SignupP2pCredentialsController);
})();
