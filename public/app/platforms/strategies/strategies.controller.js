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
        constructor($routeParams, constantsService, $location, cssInjector, strategiesService, platformService, authenticationService, notificationService, spinnerService, $cookieStore, SweetAlert) {
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
            platformService.getPlatforms(email, response => {
                response.data.some(p => {
                    if (p.originator == platform) {
                        vm.strategies = p[market].buyStrategies;
                        return true;
                    }
                });
                spinnerService.off();
            });

            let rulesPriorityMinusOne;
            vm.sortableOptions = {
                update() {
                    rulesPriorityMinusOne = vm.strategies;
                },
                stop() {
                    spinnerService.on();
                    strategiesService.updateStrategies(vm.strategies, email, platform, market,
                        () => spinnerService.off(),
                        () => {
                            spinnerService.off();
                            vm.strategies = rulesPriorityMinusOne;
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
              SweetAlert.swal({
                  title: "Are you sure?",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Yes",
                  cancelButtonText: "No",
                  closeOnConfirm: true,
                  closeOnCancel: true
            },
            function(isConfirm) {
              if (isConfirm) {
                updateOneRule(rule, (rules, index) => {
                    rules.splice(index, 1);
                    return rules;
                });
              }
            });
            };

            vm.editStrategy = id => $location.path(`/platforms/strategies/${platform}/${market}/strategyEdit/${id}`);
            vm.newStrategy = id => $location.path(`/platforms/strategies/${platform}/${market}/strategyEdit/`);

            vm.goToPrimaryMarket = () => $location.path(`/platforms/strategies/${platform}/primary`);
            vm.goToSecondMarket = () => $location.path(`/platforms/strategies/${platform}/secondary`);

            function updateOneRule(rule, transformation) {
                spinnerService.on();
                const rulesCopy = clone(vm.strategies);
                let ruleToDeleteIndex;
                if (rulesCopy.some((aRule, index) => {
                        if (aRule.name == rule.name) {
                            ruleToDeleteIndex = index;
                            return true;
                        }
                    })) {
                    const transformedRules = transformation(rulesCopy, ruleToDeleteIndex);
                    strategiesService.updateStrategies(transformedRules, email, platform, market,
                        () => {
                            vm.strategies = rulesCopy;
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
