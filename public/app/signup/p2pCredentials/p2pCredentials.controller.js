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
        constructor($cookies, $location, $timeout) {
            const vm = this;

            vm.pageClass = 'signup-login blue';

            (() => {
                const platforms = $cookies.getObject('signup.platforms');
                if (platforms) {
                    vm.pageNo = 8;
                }
                else {
                    vm.pageNo = 7;
                    $timeout(() => vm.pageNo++, 1000);
                }
            })();

            (() => {
                const email = $cookies.get('signup.email');
                const password = $cookies.get('signup.password');
                const terms = $cookies.get('signup.terms');
                const reason = $cookies.get('signup.reason');
                const income = $cookies.get('signup.income');
                const timeline = $cookies.get('signup.timeline');
                const birthday = $cookies.get('signup.birthday');
                const originator = $cookies.get('signup.originator');
                const extension = $cookies.get('signup.extension');

                if (!(email && password && terms && reason && income && timeline && birthday && originator)) {
                    $location.path('/signup');
                }

                vm.originator = originator;
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
                    const platform = {originator: vm.originator, apiKey: vm.apiKey, accountId: vm.accountId};
                    const platforms = $cookies.getObject('signup.platforms');

                    if (platforms) {
                        if (!platforms.some(p => {
                            if (p.originator === platform.originator) {
                                p.apiKey = platform.apiKey;
                                p.accountId = platform.accountId;
                                return true;
                            }
                            return false;
                        })) {
                            platforms.push(platform);
                        }

                        $cookies.putObject('signup.platforms', platforms);
                    }
                    else {
                        $cookies.putObject('signup.platforms', [platform]);
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
