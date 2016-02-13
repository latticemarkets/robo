/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 11/02/2016
*/

(() => {
    'use strict';

    class RulesController {
        constructor($routeParams, constantsService, $location, cssInjector, rulesService, userService, authenticationService, notificationService) {
            var vm = this;
            cssInjector.add("assets/stylesheets/homer_style.css");

            const email = authenticationService.getCurrentUsersEmail();
            const platform = $routeParams.platform;

            if (!constantsService.platforms().some(realPlatform => realPlatform == platform)) {
                $location.path('/strategies');
            }

            vm.spinner = true;
            userService.userData(email, response => {
                response.data.platforms.some(p => {
                    if (p.name == platform) {
                        vm.rules = p.rules;
                        return true;
                    }
                });
                vm.spinner = false;
            });

            let rulesPriorityMinusOne;
            vm.sortableOptions = {
                update() {
                    rulesPriorityMinusOne = vm.rules;
                },
                stop() {
                    vm.spinner = true;
                    rulesService.updateRules(vm.rules, email, platform,
                        () => vm.spinner = false,
                        () => {
                            vm.spinner = false;
                            vm.rules = rulesPriorityMinusOne;
                        }
                    );
                }
            };

            vm.pause = rule => {
                updateOneRule(rule, (rules, index) => {
                    rules[index].pause = !rules[index].pause;
                    return rules;
                });
            };

            vm.delete = rule => {
                updateOneRule(rule, (rules, index) => {
                    rules.splice(index, 1);
                    return rules;
                });
            };

            vm.editRule = id => $location.path(`/strategies/rules/${platform}/ruleEdit/${id}`);

            function updateOneRule(rule, transformation) {
                vm.spinner = true;
                const rulesCopy = clone(vm.rules);
                let ruleToDeleteIndex;
                if (rulesCopy.some((aRule, index) => {
                        if (aRule.name == rule.name) {
                            ruleToDeleteIndex = index;
                            return true;
                        }
                    })) {
                    const transformedRules = transformation(rulesCopy, ruleToDeleteIndex);
                    rulesService.updateRules(transformedRules, email, platform,
                        () => {
                            vm.rules = rulesCopy;
                            vm.spinner = false;
                        },
                        () => vm.spinner = false
                );
                }
                else {
                    notificationService.error('An error occurred');
                }
            }

            function clone(obj) {
                return JSON.parse(JSON.stringify(obj));
            }
        }
    }

    angular
        .module('app')
        .controller('RulesController', RulesController);
})();