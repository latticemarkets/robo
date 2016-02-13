/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 13/02/2016
*/

(() => {
    'use strict';

    class RuleEditController {
        constructor(authenticationService, $routeParams, constantsService, userService, $location, cssInjector) {
            var vm = this;

            cssInjector.add("assets/stylesheets/homer_style.css");

            const email = authenticationService.getCurrentUsersEmail();
            const platform = $routeParams.platform;
            if (!constantsService.platforms().some(realPlatform => realPlatform == platform)) {
                $location.path('/strategies');
            }

            const ruleId = $routeParams.ruleId;
            vm.spinner = true;
            userService.userData(email, response => {
                response.data.platforms.some(p => {
                    if (p.name == platform) {
                        if (!p.rules.some(rule => {
                            if (rule.id == ruleId) {
                                vm.rule = rule;
                                return true;
                            }
                        })) {
                            $location.path(`/strategies/rules/${platform}`);
                        }
                        return true;
                    }
                });
                vm.spinner = false;
            });
        }
    }

    angular
        .module('app')
        .controller('RuleEditController', RuleEditController);
})();