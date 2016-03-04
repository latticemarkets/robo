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

describe('StrategyEditController', () => {
    let strategyEditController,
        $routeParams,
        constantsService,
        $location,
        spinnerService,
        platformService,
        rulesService,
        notificationService,
        $cookies,
        SweetAlert,
        $timeout;

    beforeEach(module('app'));

    let urlOriginator;
    beforeEach(() => {
        urlOriginator = 'a';
    });

    let urlRuleId;
    beforeEach(() => {
        urlRuleId = 'id1';
    });

    beforeEach(() => {
        $location = jasmine.createSpyObj('$location', ['path']);
        $routeParams = { platform: urlOriginator, market: 'primary' };

        spinnerService = jasmine.createSpyObj('spinnerService', ['on', 'off']);
    });

    let getPlatformsCallback;
    beforeEach(() => {
        platformService = jasmine.createSpyObj('platformService', ['getPlatforms', 'updatePlatforms']);
        platformService.getPlatforms.and.callFake(callback => getPlatformsCallback = callback);
        platformService.updatePlatforms.and.callFake((platforms, callback) => callback());
    });

    let baseCriteriaName,
        baseCriteriaAttribute,
        baseCriterion,
        expendedBaseCriterion,
        sliderName,
        newStrategy,
        unexpendedBaseCriterion,
        unexpendedStrategyObj,
        expendedRule;
    beforeEach(() => {
        baseCriteriaName = 'name1';
        baseCriteriaAttribute = 'attr1';
        sliderName = 'All letters Name';
        newStrategy = {
            id: 'POIP',
            name: 'New Rule',
            originator: urlOriginator,
            expectedReturn: {
                value: 0,
                percent: 0.3,
                margin: 0
            },
            loansAvailablePerWeek: 0,
            moneyAvailablePerWeek: 0,
            rules: [],
            isEnabled: true,
            minNoteAmount: 25,
            maxNoteAmount: 25,
            maximumDailyInvestment: 250
        };

        baseCriterion = { attribute: baseCriteriaAttribute, name: baseCriteriaName};
        expendedBaseCriterion = { id: urlRuleId, rules: [], attribute: baseCriteriaAttribute, name: baseCriteriaName, type: 'slider', ruleParams: 5, slider: { name: sliderName, min: 0, max: 10, step: 1, format: () => jasmine.any(String)}};
        unexpendedBaseCriterion = { ruleType: 'InRange', ruleParams: 5 };
        unexpendedStrategyObj = { rules: [unexpendedBaseCriterion] };
        expendedRule = {"attribute":baseCriteriaAttribute,"name":baseCriteriaName, "type":"slider", "ruleParams":5 ,"slider":{"name":sliderName, "min":0, "max":10," step":1, format: () => jasmine.any(String)}};

        rulesService = jasmine.createSpyObj('rulesService', ['baseCriteria', 'expendStrategyObject', 'initializeStrategy', 'unexpendStrategyObject', 'expendRule']);
        rulesService.baseCriteria.and.returnValue([baseCriterion]);
        rulesService.expendStrategyObject.and.returnValue(expendedBaseCriterion);
        rulesService.initializeStrategy.and.returnValue(newStrategy);
        rulesService.unexpendStrategyObject.and.returnValue(unexpendedStrategyObj);
        rulesService.expendRule.and.returnValue(expendedRule);
    });

    beforeEach(() => {
        notificationService = jasmine.createSpyObj('notificationService', ['error']);
    });

    beforeEach(() => {
        $cookies = jasmine.createSpyObj('$cookies', ['put']);
    });

    beforeEach(() => {
        SweetAlert = jasmine.createSpyObj('SweetAlert', ['swal']);
    });

    describe('called with good platform and ruleId URL parameters', () => {
        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms', 'markets']);
            constantsService.platforms.and.returnValue([urlOriginator]);
            constantsService.markets.and.returnValue(['primary']);
            $routeParams.strategyId = urlRuleId;
        });

        beforeEach(inject(($controller, _$timeout_) => {
            strategyEditController = $controller('StrategyEditController', {
                notificationService: notificationService,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                rulesService: rulesService,
                spinnerService: spinnerService,
                platformService: platformService,
                $cookies: $cookies,
                $timeout: _$timeout_,
                SweetAlert: SweetAlert
            });

            $timeout = _$timeout_;
        }));

        describe('test parameter platform', () => {
            it('should get the platforms list from constant\'s service', () => {
                expect(constantsService.platforms).toHaveBeenCalled();
            });

            it('should stay on the page', () => {
                expect($location.path).not.toHaveBeenCalled();
            });
        });

        describe('test parameter ruleId', () => {
            it('should stay on the page', () => {
                expect($location.path).not.toHaveBeenCalled();
            });
        });

        describe('getPlatforms', () => {
            describe('get appropriate rule', () => {
                beforeEach(() => {
                    getPlatformsCallback({ data: [{ originator: urlOriginator, primary: { buyStrategies: [{id: urlRuleId, rules: []}] } }] });
                });

                it('should get the right rule', () => {
                    expect(strategyEditController.strategy).toEqual(expendedBaseCriterion);
                });

                it('should stop the spinner on success', () => {
                    expect(spinnerService.off).toHaveBeenCalled();
                });
            });
        });

        describe('controller methods', () => {
            beforeEach(() => {
                getPlatformsCallback({ data: [{ originator: urlOriginator, primary: { buyStrategies: [{id: urlRuleId, rules: []}] } }] });
            });

            describe('addRule', () => {
                beforeEach(() => {
                    strategyEditController.addRule(baseCriterion);
                });

                it('should add the criterion in the strategy\'s list', () => {
                    expect(strategyEditController.strategy.rules.length).toBe(1);
                    expect(strategyEditController.strategy.rules[0]).toEqual(expendedRule);
                });

                it('should remove the criterion of base criteria\'s list', () => {
                    expect(strategyEditController.baseCriteria.length).toBe(0);
                });
            });

            describe('remove', () => {
                beforeEach(() => {
                    strategyEditController.remove(expendedBaseCriterion);
                });

                it('should remove the rule from the list', () => {
                    expect(strategyEditController.strategy.rules.length).toBe(0);
                });

                it('should add the rule into the base criteria list', () => {
                    expect(strategyEditController.baseCriteria.length).toBe(1);
                    expect(strategyEditController.baseCriteria[0]).toEqual(baseCriterion);
                });
            });

            describe('saveRule', () => {
                beforeEach(() => {
                    strategyEditController.addRule(baseCriterion);
                    strategyEditController.saveRule();
                });

                it('should set the spinner to on', () => {
                    expect(spinnerService.on).toHaveBeenCalled();
                });

                it('should add the rule to platform object', () => {
                    expect(strategyEditController.platforms[0].primary.buyStrategies[0].rules.length).toBe(1);
                    expect(strategyEditController.platforms[0].primary.buyStrategies[0].rules[0]).toEqual(unexpendedBaseCriterion);
                });

                it('should set the spinner to off', () => {
                    expect(spinnerService.off).toHaveBeenCalled();
                });

                it('should add a cookie to notif the success to the next page', () => {
                    expect($cookies.put).toHaveBeenCalledWith('newCriteriaSuccess', true);
                });

                it('should go back to the strategies page', () => {
                    expect($location.path).toHaveBeenCalledWith(`/platforms/strategies/${urlOriginator}/primary`);
                });
            });

            describe('cancel', () => {
                describe('the user confirms', () => {
                    beforeEach(() => {
                        SweetAlert.swal.and.callFake((obj, callback) => callback(true));
                        strategyEditController.cancel();
                        $timeout.flush();
                    });

                    it('should call the sweet alert', () => {
                        expect(SweetAlert.swal).toHaveBeenCalled();
                    });

                    it('should go back to strategies page with no cookie', () => {
                        expect($cookies.put).not.toHaveBeenCalled();
                        expect($location.path).toHaveBeenCalledWith(`/platforms/strategies/${urlOriginator}/primary`);
                    });
                });

                describe('the user doesn\'t confirm the cancellation', () => {
                    beforeEach(() => {
                        SweetAlert.swal.and.callFake((obj, callback) => callback(false));
                        strategyEditController.cancel();
                    });

                    it('should call the sweet alert', () => {
                        expect(SweetAlert.swal).toHaveBeenCalled();
                    });

                    it('should stay on the page', () => {
                        expect($location.path).not.toHaveBeenCalled();
                    });
                });
            });

            describe('showGhostBox', () => {
                describe('add a rule', () => {
                    beforeEach(() => {
                        strategyEditController.addRule(baseCriterion);
                    });

                    it('should not display the ghost box', () => {
                        expect(strategyEditController.showGhostBox()).toBeFalsy();
                    });
                });

                describe('no rule at the beginning', () => {
                    it('should display the ghost box', () => {
                        expect(strategyEditController.showGhostBox()).toBeTruthy();
                    });
                });
            });

            describe('onMinChange', () => {
                describe('min stays lower than max', () => {
                    beforeEach(() => {
                        strategyEditController.strategy.maxNoteAmount = 100;
                        strategyEditController.onMinChange(90);
                    });

                    it('should not change max\'s value', () => {
                        expect(strategyEditController.strategy.maxNoteAmount).toBe(100);
                    });
                });

                describe('min goes higher than max', () => {
                    beforeEach(() => {
                        strategyEditController.strategy.maxNoteAmount = 100;
                        strategyEditController.onMinChange(110);
                    });

                    it('should change max\'s value', () => {
                        expect(strategyEditController.strategy.maxNoteAmount).toBe(110);
                    });
                });
            });

            describe('onMaxChange', () => {
                describe('max stays higher than min', () => {
                    beforeEach(() => {
                        strategyEditController.strategy.minNoteAmount = 100;
                        strategyEditController.onMaxChange(200);
                    });

                    it('should not change min\'s value', () => {
                        expect(strategyEditController.strategy.minNoteAmount).toBe(100);
                    });
                });

                describe('max goes lower than min', () => {
                    beforeEach(() => {
                        strategyEditController.strategy.minNoteAmount = 100;
                        strategyEditController.onMaxChange(50);
                    });

                    it('should change min\'s value', () => {
                        expect(strategyEditController.strategy.minNoteAmount).toBe(50);
                    });
                });
            });
        });

    });

    describe('called with bad platform URL parameter', () => {
        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms', 'markets']);
            constantsService.platforms.and.callFake(() => ['b']);
            constantsService.markets.and.callFake(() => ['primary']);
        });

        beforeEach(inject(($controller) => {
            strategyEditController = $controller('StrategyEditController', {
                notificationService: notificationService,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                platformService: platformService,
                rulesService: rulesService
            });
        }));

        describe('parameter test', () => {
            it('should get the platforms list from constant\'s service', () => {
                expect(constantsService.platforms).toHaveBeenCalled();
            });

            it('should be redirected to strategies\' page', () => {
                expect($location.path).toHaveBeenCalledWith('/platforms')
            });
        });
    });

    describe('called with good platform URL parameter but bad ruleId URL parameter', () => {
        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms', 'markets']);
            constantsService.platforms.and.callFake(() => [urlOriginator]);
            constantsService.markets.and.callFake(() => ['primary']);
            $routeParams.strategyId = 'id1986859';
        });

        beforeEach(inject(($controller) => {
            strategyEditController = $controller('StrategyEditController', {
                notificationService: notificationService,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                spinnerService: spinnerService,
                platformService: platformService,
                rulesService: rulesService
            });
        }));

        beforeEach(() => {
            getPlatformsCallback({ data: [{ originator: urlOriginator, primary: { buyStrategies: [{id: urlRuleId, rules: []}] } }] });
        });

        describe('parameters test', () => {
            it('should get the platforms list from constant\'s service', () => {
                expect(constantsService.platforms).toHaveBeenCalled();
            });

            it('should be redirected to platform\'s page', () => {
                expect($location.path).toHaveBeenCalledWith('/platforms/strategies/a/primary');
            });
        });
    });

    describe('called with good platform URL parameter and no ruleId URL parameter', () => {
        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms', 'markets']);
            constantsService.platforms.and.callFake(() => [urlOriginator]);
            constantsService.markets.and.callFake(() => ['primary']);
            $routeParams.strategyId = undefined;
        });

        beforeEach(inject(($controller) => {
            strategyEditController = $controller('StrategyEditController', {
                notificationService: notificationService,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                spinnerService: spinnerService,
                platformService: platformService,
                rulesService: rulesService
            });
        }));

        beforeEach(() => {
            getPlatformsCallback({ data: [{ originator: urlOriginator, primary: { buyStrategies: [{id: urlRuleId, rules: []}] } }] });
        });

        describe('parameters test', () => {
            it('should get the platforms list from constant\'s service', () => {
                expect(constantsService.platforms).toHaveBeenCalled();
            });

            it('should initialize a new rule object', () => {
                expect(strategyEditController.strategy).toEqual({
                    id: jasmine.any(String),
                    name: jasmine.any(String),
                    originator: jasmine.any(String),
                    rules: [],
                    expectedReturn: jasmine.any(Object),
                    loansAvailablePerWeek: jasmine.any(Number),
                    moneyAvailablePerWeek: jasmine.any(Number),
                    isEnabled: jasmine.any(Boolean),
                    minNoteAmount: 25,
                    maxNoteAmount: 25,
                    maximumDailyInvestment: 250
                });
            });
        });
    });
});