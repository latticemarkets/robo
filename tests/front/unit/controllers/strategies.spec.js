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

describe('StrategiesController', () => {
    let strategiesController,
        cssInjector,
        $routeParams,
        constantsService,
        $location,
        authenticationService,
        userService,
        strategiesService,
        spinnerService;

    beforeEach(module('app'));

    beforeEach(() => {
        cssInjector = jasmine.createSpyObj('cssInjector', ['add']);
        $location = jasmine.createSpyObj('$location', ['path']);
        $routeParams = { platform: 'a', market: 'primary' };

        authenticationService = jasmine.createSpyObj('authenticationService', ['getCurrentUsersEmail']);
        authenticationService.getCurrentUsersEmail.and.returnValue('toto@tata.fr');

        strategiesService = jasmine.createSpyObj('strategiesService', ['updateRules']);

        userService = jasmine.createSpyObj('userService', ['userData']);
        userService.userData.and.callFake((email, callback) => callback({data: {platforms: [{name: 'a', primary: { rules:[{name: 'rule1', isEnabled: true}, {name: 'rule2', isEnabled: false}, {name: 'rule3', isEnabled: false}] }}, {name: 'b', rules: [{isEnabled: false}]}]}}));

        spinnerService = jasmine.createSpyObj('spinnerService', ['on', 'off']);
    });

    describe('called with good URL parameter', () => {
        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms', 'markets']);
            constantsService.platforms.and.returnValue(['a']);
            constantsService.markets.and.returnValue(['primary']);
        });

        beforeEach(inject(($controller) => {
            strategiesController = $controller('StrategiesController', {
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                userService: userService,
                strategiesService: strategiesService,
                spinnerService: spinnerService
            });
        }));

        describe('cssInjection', () => {
            it('should inject Homer css stylesheet on initialization', () => {
                expect(cssInjector.add).toHaveBeenCalledWith('assets/stylesheets/homer_style.css');
            });
        });

        describe('parameter test', () => {
            it('should get the platforms list from constant\'s service', () => {
                expect(constantsService.platforms).toHaveBeenCalled();
            });

            it('should stay on the page', () => {
                expect($location.path).not.toHaveBeenCalled();
            });
        });

        describe('get appropriate rules', () => {
            it('should get the right rules', () => {
                expect(strategiesController.rules.length).toBe(3);
                expect(strategiesController.rules[0].isEnabled).toBe(true);
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

        describe('pause', () => {
            describe('on success', () => {
                beforeEach(() => {
                    strategiesService.updateRules.and.callFake((rules, email, platform, market, success, error) => success());
                    expect(strategiesController.rules[0].isEnabled).toBeTruthy();
                    strategiesController.pause(strategiesController.rules[0]);
                });

                it('should call strategiesService.updateRules', () => {
                    expect(strategiesService.updateRules).toHaveBeenCalled();
                });

                it('should stop the spinner', () => {
                    expect(spinnerService.off).toHaveBeenCalled();
                });

                it('should have changed the rule.isEnabled state', () => {
                    expect(strategiesController.rules[0].isEnabled).toBeFalsy();
                });
            });

            describe('on error', () => {
                beforeEach(() => {
                    strategiesService.updateRules.and.callFake((rules, email, platform, market, success, error) => error());
                    expect(strategiesController.rules[0].isEnabled).toBeTruthy();
                    strategiesController.pause(strategiesController.rules[0]);
                });

                it('should call strategiesService.updateRules', () => {
                    expect(strategiesService.updateRules).toHaveBeenCalled();
                });

                it('should stop the spinner', () => {
                    expect(spinnerService.off).toHaveBeenCalled();
                });

                it('should have changed back the rule.isEnabled state', () => {
                    expect(strategiesController.rules[0].isEnabled).toBeTruthy();
                });
            });
        });

        describe('delete', () => {
            describe('on success', () => {
                beforeEach(() => {
                    strategiesService.updateRules.and.callFake((rules, email, platform, market, success, error) => success());
                    expect(strategiesController.rules.length).toBe(3);
                    strategiesController.delete(strategiesController.rules[2]);
                });

                it('should call rules service to update the list', () => {
                    expect(strategiesService.updateRules).toHaveBeenCalled();
                });

                it('should stop the spinner', () => {
                    expect(spinnerService.off).toHaveBeenCalled();
                });

                it('should update the scoped list of rules', () => {
                    expect(strategiesController.rules.length).toBe(2);
                });
            });

            describe('on error', () => {
                beforeEach(() => {
                    strategiesService.updateRules.and.callFake((rules, email, platform, market, success, error) => error());
                    expect(strategiesController.rules.length).toBe(3);
                    strategiesController.delete(strategiesController.rules[2]);
                });

                it('should call rules service to update the list', () => {
                    expect(strategiesService.updateRules).toHaveBeenCalled();
                });

                it('should stop the spinner', () => {
                    expect(spinnerService.off).toHaveBeenCalled();
                });

                it('should not update the scoped list of rules', () => {
                    expect(strategiesController.rules.length).toBe(3);
                });
            });
        });

        describe('rearrange priority', () => {
            beforeEach(() => {
                strategiesController.sortableOptions.update();
                strategiesController.rules = [{name: 'rule1', isEnabled: true}, {name: 'rule3', isEnabled: false}, {name: 'rule2', isEnabled: false}];
            });

            describe('on success', () => {
                beforeEach(() => {
                    strategiesService.updateRules.and.callFake((rules, email, platform, market, success, error) => success());
                    strategiesController.sortableOptions.stop();
                });

                it('should stop the spinner', () => {
                    expect(spinnerService.off).toHaveBeenCalled();
                });

                it('should have rearrange the rules priority', () => {
                    expect(strategiesController.rules).toEqual([{name: 'rule1', isEnabled: true}, {name: 'rule3', isEnabled: false}, {name: 'rule2', isEnabled: false}]);
                });
            });

            describe('on error', () => {
                beforeEach(() => {
                    strategiesService.updateRules.and.callFake((rules, email, platform, market, success, error) => error());
                    strategiesController.sortableOptions.stop();
                });

                it('should stop the spinner', () => {
                    expect(spinnerService.off).toHaveBeenCalled();
                });

                it('should rearrange back the rules priority', () => {
                    expect(strategiesController.rules).toEqual([{name: 'rule1', isEnabled: true}, {name: 'rule2', isEnabled: false}, {name: 'rule3', isEnabled: false}]);
                });
            });
        });
    });

    describe('called with bad URL parameter', () => {

        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms']);
            constantsService.platforms.and.callFake(() => ['b']);
        });

        beforeEach(inject(($controller) => {
            strategiesController = $controller('StrategiesController', {
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                userService: userService,
                strategiesService: strategiesService,
                spinnerService: spinnerService
            });
        }));

        describe('parameter test', () => {
            it('should get the platforms list from constant\'s service', () => {
                expect(constantsService.platforms).toHaveBeenCalled();
            });

            it('should be redirected to strategies\' pages', () => {
                expect($location.path).toHaveBeenCalledWith('/platforms')
            });
        });
    });
});