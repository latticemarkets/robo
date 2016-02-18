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
        userService,
        spinnerService;

    beforeEach(module('app'));

    beforeEach(() => {
        cssInjector = jasmine.createSpyObj('cssInjector', ['add']);
        $location = jasmine.createSpyObj('$location', ['path']);
        $routeParams = { platform: 'a', market: 'primary' };

        authenticationService = jasmine.createSpyObj('authenticationService', ['getCurrentUsersEmail']);
        authenticationService.getCurrentUsersEmail.and.returnValue('toto@tata.fr');

        userService = jasmine.createSpyObj('userService', ['userData']);
        userService.userData.and.callFake((email, callback) => callback({data: {platforms: [{name: 'a', primary: { rules: [{id: "id1", name: 'rule1', pause: true, criteria:[{id:'fdlsjf', typeKey:'expectedReturn', value: '4000'}]}, {id: "id2", name: 'rule2', pause: false, criteria:[{id:'fdlsjf', typeKey:'expectedReturn', value: '4000'}]}, {id: "id3", name: 'rule3', pause: false, criteria:[{id:'fdlsjf', typeKey:'expectedReturn', value: '4000'}] }] }}, {name: 'b', rules: [{pause: false, criteria:[{id:'fdlsjf', typeKey:'expectedReturn', value: '4000'}]}]}]}}));

        spinnerService = jasmine.createSpyObj('spinnerService', ['on', 'off']);
    });

    describe('called with good platform and ruleId URL parameters', () => {
        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms', 'markets']);
            constantsService.platforms.and.returnValue(['a']);
            constantsService.markets.and.returnValue(['primary']);
            $routeParams.ruleId = 'id1';
        });

        beforeEach(inject(($controller, criteriaService) => {
            strategyEditController = $controller('StrategyEditController', {
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                userService: userService,
                criteriaService: criteriaService,
                spinnerService: spinnerService
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

        describe('get appropriate rule', () => {
            it('should get the right rule', () => {
                expect(strategyEditController.rule).toEqual({ id: 'id1', name: 'rule1', pause: true, criteria: jasmine.any(Array)});
            });

            it('should call user service', () => {
                expect(userService.userData).toHaveBeenCalled();
            });

            it('should stop the spinner on success', () => {
                expect(spinnerService.off).toHaveBeenCalled();
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
                userService: userService
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
            constantsService.platforms.and.callFake(() => ['a']);
            constantsService.markets.and.callFake(() => ['primary']);
            $routeParams.ruleId = 'id1986859';
        });

        beforeEach(inject(($controller) => {
            strategyEditController = $controller('StrategyEditController', {
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                userService: userService,
                spinnerService: spinnerService
            });
        }));

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
            constantsService.platforms.and.callFake(() => ['a']);
            constantsService.markets.and.callFake(() => ['primary']);
            $routeParams.ruleId = undefined;
        });

        beforeEach(inject(($controller) => {
            strategyEditController = $controller('StrategyEditController', {
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                userService: userService,
                spinnerService: spinnerService
            });
        }));

        describe('parameters test', () => {
            it('should get the platforms list from constant\'s service', () => {
                expect(constantsService.platforms).toHaveBeenCalled();
            });

            it('should initialize a new rule object', () => {
                expect(strategyEditController.rule).toEqual({ id: jasmine.any(String), name: jasmine.any(String), criteria: [], originator: jasmine.any(String), expectedReturn: jasmine.any(Object), loansAvailablePerWeek: jasmine.any(Number), moneyAvailablePerWeek: jasmine.any(Number), isEnabled: jasmine.any(Boolean), minNoteAmount: 25, maxNoteAmount: 25 });
            });
        });
    });
});