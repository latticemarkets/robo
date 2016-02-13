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

            vm.pause = rule => {
                vm.spinner = true;
                rule.pause = !rule.pause;
                rulesService.updateRules(vm.rules, email, platform,
                    () => vm.spinner = false,
                    () => {
                        rule.pause = !rule.pause;
                        vm.spinner = false;
                    }
                );
            };

            vm.delete = rule => {
                vm.spinner = true;
                const newRules = this.clone(vm);
                let ruleToDeleteIndex;
                if (newRules.some((aRule, index) => {
                    if (aRule.name == rule.name) {
                        ruleToDeleteIndex = index;
                        return true;
                    }
                })) {
                    newRules.splice(ruleToDeleteIndex, 1);
                    rulesService.updateRules(newRules, email, platform,
                        () => {
                            vm.rules = newRules;
                            vm.spinner = false;
                        },
                        () => {
                            rule.pause = !rule.pause;
                            vm.spinner = false;
                        }
                    );
                }
                else {
                    notificationService.error('An error occurred');
                }
            };
        }

        clone(vm) {
            return JSON.parse(JSON.stringify(vm.rules));
        }
    }

    angular
        .module('app')
        .controller('RulesController', RulesController);
})();