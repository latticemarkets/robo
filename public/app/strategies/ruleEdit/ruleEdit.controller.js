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
        constructor(authenticationService, $routeParams, constantsService, userService, $location, cssInjector, criteriaService, notificationService) {
            var vm = this;

            const defaultName = "New Rule";
            const email = authenticationService.getCurrentUsersEmail();

            const platform = $routeParams.platform;
            const ruleId = $routeParams.ruleId;

            getCriteria();
            checkUrlParameters();
            injectCss();

            vm.addCriterion = criterion => {
                vm.rule.criteria.push(criteriaService.expendCriterion(criterion));
                vm.baseCriteria = vm.baseCriteria.filter(baseCriterion => criterion.typeKey !== baseCriterion.typeKey);
            };

            vm.saveCriteria = () => {
                updatePlatforms();
                vm.spinner = true;
                userService.updatePlatforms(email, vm.platforms, () => {
                    vm.spinner = false;
                    notificationService.success("Your criteria have been updated");
                });
            };

            vm.showGhostBox = () => {
                if (vm.rule) {
                    return vm.rule.criteria.length === 0;
                }
            };

            /**
             * Functions
             */

            function injectCss() {
                cssInjector.add("assets/stylesheets/homer_style.css");
            }

            function updatePlatforms() {
                vm.platforms.forEach(p => {
                    if (p.name === platform) {
                        p.rules.forEach(r => {
                            if (r.id === ruleId) {
                                var criteria = criteriaService.unexpendCriteriaObject(vm.rule);
                                console.table(criteria);
                                r.criteria = criteria;
                            }
                        });
                    }
                });
            }

            function getCriteria() {
                vm.baseCriteria = criteriaService.baseCriteria;
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
                                    vm.platforms = response.data.platforms;
                                    if (!p.rules.some(rule => {
                                            if (rule.id == ruleId) {
                                                vm.rule = criteriaService.expendCriteriaObject(JSON.parse(JSON.stringify(rule)));
                                                vm.baseCriteria = vm.baseCriteria.filter(baseCriterion => vm.rule.criteria.every(criterion => criterion.typeKey !== baseCriterion.typeKey));
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
