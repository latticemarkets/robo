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
        constructor(authenticationService, $routeParams, constantsService, $location, cssInjector, rulesService, $cookieStore, spinnerService, $timeout, platformService, notificationService, SweetAlert) {
            var vm = this;

            const email = authenticationService.getCurrentUsersEmail();

            const platform = $routeParams.platform;
            const strategyId = $routeParams.strategyId;
            const market = $routeParams.market;

            getCriteria();
            checkUrlParameters();
            injectCss();

            vm.addRule = criterion => {
                vm.strategy.rules.push(rulesService.expendStrategyObject(criterion));
                vm.baseCriteria = vm.baseCriteria.filter(baseCriterion => criterion.attribute !== baseCriterion.attribute);
            };

            vm.remove = attribute => {
                vm.strategy.rules = vm.strategy.rules.filter(criterion => criterion.attribute !== attribute);
                rulesService.baseCriteria(market).some(criterion => {
                    if (criterion.attribute == attribute) {
                        vm.baseCriteria.push(criterion);
                    }
                });
            };

            vm.saveRule = () => {
                updatePlatforms();
                spinnerService.on();
                platformService.updatePlatforms(email, vm.platforms, () => {
                    spinnerService.off();
                    $cookieStore.put('newCriteriaSuccess', true);
                    $location.path(`/platforms/strategies/${platform}/${market}`);
                });
            };

            vm.cancel = () => {
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
                      $timeout(() => $location.path(`/platforms/strategies/${platform}/${market}`), 500);
                    }
                  });
            };

            vm.showGhostBox = () => {
                if (vm.strategy) {
                    if (vm.strategy.rules) {
                        return vm.strategy.rules.length === 0;
                    }
                }
            };

            vm.onMinChange = min => {
                if (vm.strategy) {
                    if (parseInt(min) > parseInt(vm.strategy.maxNoteAmount)) {
                        vm.strategy.maxNoteAmount = parseInt(min);
                    }
                }
            };

            vm.onMaxChange = max => {
                if (vm.strategy) {
                    if (parseInt(max) < parseInt(vm.strategy.minNoteAmount)) {
                        vm.strategy.minNoteAmount = parseInt(max);
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
                    if (p.originator === platform) {
                        if (p[market].buyStrategies.length === 0) {
                            p[market].buyStrategies = [rulesService.unexpendStrategyObject(vm.strategy)];
                        }
                        else if (!strategyId) {
                            p[market].buyStrategies.push(rulesService.unexpendStrategyObject(vm.strategy));
                        }
                        else {
                            p[market].buyStrategies = p[market].buyStrategies.map(r => {
                                if (r.id === strategyId) {
                                    return rulesService.unexpendStrategyObject(vm.strategy);
                                }
                                return r;
                            });
                        }
                    }
                });
            }

            function getCriteria() {
                vm.baseCriteria = rulesService.baseCriteria(market);
                if (!vm.baseCriteria) {
                    notificationService.error('An error occured, you will be redirected');
                    $timeout(() => $location.path('/platforms'), 1000);
                }
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
                    platformService.getPlatforms(email, response => {
                        response.data.some(p => {
                            if (p.originator == platform) {
                                vm.platforms = response.data;
                                if (strategyId) {
                                    if (!p[market].buyStrategies.some(strategy => {
                                            if (strategy.id == strategyId) {
                                                vm.strategy = rulesService.expendStrategyObject(JSON.parse(JSON.stringify(strategy)));
                                                vm.baseCriteria = vm.baseCriteria.filter(baseCriterion => vm.strategy.rules.every(rule => rule.attribute !== baseCriterion.attribute));
                                                return true;
                                            }
                                        })) {
                                        $location.path(`/platforms/strategies/${platform}/${market}`);
                                    }
                                }
                                else {
                                    vm.strategy = rulesService.initializeStrategy(platform);
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
