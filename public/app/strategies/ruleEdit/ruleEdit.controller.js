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
        constructor(authenticationService, $routeParams, constantsService, userService, $location, cssInjector, CriteriaService) {
            var vm = this;

            const defaultName = "New Rule";
            const email = authenticationService.getCurrentUsersEmail();

            const platform = $routeParams.platform;
            const ruleId = $routeParams.ruleId;

            injectCss();
            checkUrlParameters();
            getCriteria();

            /**
             * Functions
             */

            function injectCss() {
                cssInjector.add("assets/stylesheets/homer_style.css");
            }

            function getCriteria() {
                vm.baseCriteria = CriteriaService.baseCriteria;
            }

            function checkUrlParameters() {
                checkPlatform();
                checkRuleId();

                function checkPlatform() {
                    if (!constantsService.platforms().some(realPlatform => realPlatform == platform)) {
                        $location.path('/strategies');
                    }
                }

                function checkRuleId() {
                    if (ruleId) {
                        vm.spinner = true;
                        userService.userData(email, response => {
                            response.data.platforms.some(p => {
                                if (p.name == platform) {
                                    if (!p.rules.some(rule => {
                                            if (rule.id == ruleId) {
                                                vm.rule = CriteriaService.expendCriteriaObject(rule);
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
                    else {
                        vm.rule = {name: defaultName, criteria: []};
                    }
                }
            }
        }
    }

    angular
        .module('app')
        .controller('RuleEditController', RuleEditController);
})();