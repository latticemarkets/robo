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

    class StrategyEditController {
        constructor(authenticationService, $routeParams, constantsService, userService, $location, cssInjector, criteriaService, $cookieStore, spinnerService) {
            var vm = this;

            const email = authenticationService.getCurrentUsersEmail();

            const platform = $routeParams.platform;
            const market = $routeParams.market;
            const ruleId = $routeParams.ruleId;

            getCriteria();
            checkUrlParameters();
            injectCss();

            vm.addCriterion = criterion => {
                vm.rule.criteria.push(criteriaService.expendCriterion(criterion));
                vm.baseCriteria = vm.baseCriteria.filter(baseCriterion => criterion.attribute !== baseCriterion.attribute);
            };

            vm.remove = attribute => vm.rule.criteria = vm.rule.criteria.filter(criterion => criterion.attribute !== attribute);

            vm.saveCriteria = () => {
                updatePlatforms();
                spinnerService.on();
                userService.updatePlatforms(email, vm.platforms, () => {
                    spinnerService.off();
                    $cookieStore.put('newCriteriaSuccess', true);
                    $location.path(`/platforms/strategies/${platform}/${market}`);
                });
            };

            vm.cancel = () => $location.path(`/platforms/strategies/${platform}/${market}`);

            vm.showGhostBox = () => {
                if (vm.rule) {
                    if (vm.rule.criteria) {
                        return vm.rule.criteria.length === 0;
                    }
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
                        if (p[market].rules.length === 0) {
                            p[market].rules = [criteriaService.unexpendCriteriaObject(vm.rule)];
                        }
                        else if (!ruleId) {
                            p[market].rules.push(criteriaService.unexpendCriteriaObject(vm.rule));
                        }
                        else {
                            p[market].rules = p[market].rules.map(r => {
                                if (r.id === ruleId) {
                                    return criteriaService.unexpendCriteriaObject(vm.rule);
                                }
                                return r;
                            });
                        }
                    }
                });
            }

            function getCriteria() {
                vm.baseCriteria = criteriaService.baseCriteria;
            }

            function checkUrlParameters() {
                checkPlatform();
                checkMarket();
                checkRuleId();

                function checkPlatform() {
                    if (!constantsService.platforms().some(realPlatform => realPlatform == platform)) {
                        $location.path('/platforms');
                    }
                }
                function checkMarket() {
                    if (!constantsService.markets().some(realMarkets => realMarkets == market)) {
                        $location.path('/platforms');
                    }
                }

                function checkRuleId() {
                    spinnerService.on();
                    userService.userData(email, response => {
                        response.data.platforms.some(p => {
                            if (p.name == platform) {
                                vm.platforms = response.data.platforms;
                                if (ruleId) {
                                    if (!p[market].rules.some(rule => {
                                            if (rule.id == ruleId) {
                                                vm.rule = criteriaService.expendCriteriaObject(JSON.parse(JSON.stringify(rule)));
                                                vm.baseCriteria = vm.baseCriteria.filter(baseCriterion => vm.rule.criteria.every(criterion => criterion.attribute !== baseCriterion.attribute));
                                                return true;
                                            }
                                        })) {
                                        $location.path(`/platforms/strategies/${platform}/${market}`);
                                    }
                                }
                                else {
                                    vm.rule = criteriaService.initializeRule(platform);
                                }
                                return true;
                            }
                        });
                        spinnerService.off();
                    });
                }
            }
        }
    }

    angular
        .module('app')
        .controller('StrategyEditController', StrategyEditController);
})();
