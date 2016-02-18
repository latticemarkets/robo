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

    class StrategiesController {
        constructor($routeParams, constantsService, $location, cssInjector, strategiesService, userService, authenticationService, notificationService, spinnerService, $cookieStore) {
            var vm = this;
            cssInjector.add("assets/stylesheets/homer_style.css");

            const email = authenticationService.getCurrentUsersEmail();
            const platform = $routeParams.platform;

            const market = $routeParams.market;
            vm.market = market;

            if (!constantsService.platforms().some(realPlatform => realPlatform == platform) || !constantsService.markets().some(realMarket => realMarket == market)) {
                $location.path('/platforms');
            }

            if ($cookieStore.get('newCriteriaSuccess')) {
                notificationService.success("Your criteria have been updated");
                $cookieStore.remove('newCriteriaSuccess');
            }

            spinnerService.on();
            userService.userData(email, response => {
                response.data.platforms.some(p => {
                    if (p.name == platform) {
                        vm.rules = p[market].rules;
                        return true;
                    }
                });
                spinnerService.off();
            });

            let rulesPriorityMinusOne;
            vm.sortableOptions = {
                update() {
                    rulesPriorityMinusOne = vm.rules;
                },
                stop() {
                    spinnerService.on();
                    strategiesService.updateRules(vm.rules, email, platform, market,
                        () => spinnerService.off(),
                        () => {
                            spinnerService.off();
                            vm.rules = rulesPriorityMinusOne;
                        }
                    );
                }
            };

            vm.pause = rule => {
                updateOneRule(rule, (rules, index) => {
                    rules[index].isEnabled = !rules[index].isEnabled;
                    return rules;
                });
            };

            vm.delete = rule => {
                updateOneRule(rule, (rules, index) => {
                    rules.splice(index, 1);
                    return rules;
                });
            };

            vm.editRule = id => $location.path(`/platforms/strategies/${platform}/${market}/strategyEdit/${id}`);
            vm.newRule = id => $location.path(`/platforms/strategies/${platform}/${market}/strategyEdit/`);

            vm.goToPrimaryMarket = () => $location.path(`/platforms/strategies/${platform}/primary`);
            vm.goToSecondMarket = () => $location.path(`/platforms/strategies/${platform}/secondary`);

            function updateOneRule(rule, transformation) {
                spinnerService.on();
                const rulesCopy = clone(vm.rules);
                let ruleToDeleteIndex;
                if (rulesCopy.some((aRule, index) => {
                        if (aRule.name == rule.name) {
                            ruleToDeleteIndex = index;
                            return true;
                        }
                    })) {
                    const transformedRules = transformation(rulesCopy, ruleToDeleteIndex);
                    strategiesService.updateRules(transformedRules, email, platform, market,
                        () => {
                            vm.rules = rulesCopy;
                            spinnerService.off();
                        },
                        () => spinnerService.off()
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
        .controller('StrategiesController', StrategiesController);
})();
