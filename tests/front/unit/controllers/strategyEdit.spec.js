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
        cssInjector,
        $routeParams,
        constantsService,
        $location,
        authenticationService,
        spinnerService,
        platformService;

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
        cssInjector = jasmine.createSpyObj('cssInjector', ['add']);
        $location = jasmine.createSpyObj('$location', ['path']);
        $routeParams = { platform: urlOriginator, market: 'primary' };

        authenticationService = jasmine.createSpyObj('authenticationService', ['getCurrentUsersEmail']);
        authenticationService.getCurrentUsersEmail.and.returnValue('toto@tata.fr');

        spinnerService = jasmine.createSpyObj('spinnerService', ['on', 'off']);
    });

    let getPlatformsCallback;
    beforeEach(() => {
        platformService = jasmine.createSpyObj('platformService', ['getPlatforms']);
        platformService.getPlatforms.and.callFake((email, callback) => getPlatformsCallback = callback);
    });

    describe('called with good platform and ruleId URL parameters', () => {
        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms', 'markets']);
            constantsService.platforms.and.returnValue([urlOriginator]);
            constantsService.markets.and.returnValue(['primary']);
            $routeParams.strategyId = urlRuleId;
        });

        beforeEach(inject(($controller, rulesService) => {
            strategyEditController = $controller('StrategyEditController', {
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                rulesService: rulesService,
                spinnerService: spinnerService,
                platformService: platformService
            });
        }));

        describe('cssInjection', () => {
            it('should inject Homer css stylesheet on initialization', () => {
                expect(cssInjector.add).toHaveBeenCalledWith('assets/stylesheets/homer_style.css');
            });
        });

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
                    expect(strategyEditController.strategy).toEqual({ id: urlRuleId, rules: jasmine.any(Array)});
                });

                it('should stop the spinner on success', () => {
                    expect(spinnerService.off).toHaveBeenCalled();
                });
            });
        });

        describe('email initialisation', () => {
            it('should call authentication service', () => {
                expect(authenticationService.getCurrentUsersEmail).toHaveBeenCalled();
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
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                platformService: platformService
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
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                spinnerService: spinnerService,
                platformService: platformService
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
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                spinnerService: spinnerService,
                platformService: platformService
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