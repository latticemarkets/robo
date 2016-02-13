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

describe('RulesController', () => {
    let rulesController,
        cssInjector,
        $routeParams,
        constantsService,
        $location,
        authenticationService,
        userService,
        rulesService;

    beforeEach(module('app'));

    beforeEach(() => {
        cssInjector = jasmine.createSpyObj('cssInjector', ['add']);
        $location = jasmine.createSpyObj('$location', ['path']);
        $routeParams = { platform: 'a' };

        authenticationService = jasmine.createSpyObj('authenticationService', ['getCurrentUsersEmail']);
        authenticationService.getCurrentUsersEmail.and.returnValue('toto@tata.fr');

        rulesService = jasmine.createSpyObj('rulesService', ['updateRules']);

        userService = jasmine.createSpyObj('userService', ['userData']);
        userService.userData.and.callFake((email, callback) => callback({data: {platforms: [{name: 'a', rules:[{name: 'rule1', pause: true}, {name: 'rule2', pause: false}, {name: 'rule3', pause: false}]}, {name: 'b', rules: [{pause: false}]}]}}));
    });

    describe('called with good URL parameter', () => {
        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms']);
            constantsService.platforms.and.returnValue(['a']);
        });

        beforeEach(inject(($controller) => {
            rulesController = $controller('RulesController', {
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                userService: userService,
                rulesService: rulesService
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
                expect(rulesController.rules.length).toBe(3);
                expect(rulesController.rules[0].pause).toBe(true);
            });

            it('should call user service', () => {
                expect(userService.userData).toHaveBeenCalled();
            });

            it('should stop the spinner on success', () => {
                expect(rulesController.spinner).toBeFalsy();
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
                    rulesService.updateRules.and.callFake((rules, email, platform, success, error) => success());
                    expect(rulesController.rules[0].pause).toBeTruthy();
                    rulesController.pause(rulesController.rules[0]);
                });

                it('should call rulesService.updateRules', () => {
                    expect(rulesService.updateRules).toHaveBeenCalled();
                });

                it('should stop the spinner', () => {
                    expect(rulesController.spinner).toBeFalsy();
                });

                it('should have changed the rule.pause state', () => {
                    expect(rulesController.rules[0].pause).toBeFalsy();
                });
            });
        });

        describe('delete', () => {
            describe('on success', () => {
                beforeEach(() => {
                    rulesService.updateRules.and.callFake((rules, email, platform, success, error) => success());
                    expect(rulesController.rules.length).toBe(3);
                    rulesController.delete(rulesController.rules[2]);
                });

                it('should call rules service to update the list', () => {
                    expect(rulesService.updateRules).toHaveBeenCalled();
                });

                it('should stop the spinner', () => {
                    expect(rulesController.spinner).toBeFalsy();
                });

                it('should update the scoped list of rules', () => {
                    expect(rulesController.rules.length).toBe(2);
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
            rulesController = $controller('RulesController', {
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                userService: userService,
                rulesService: rulesService
            });
        }));

        describe('parameter test', () => {
            it('should get the platforms list from constant\'s service', () => {
                expect(constantsService.platforms).toHaveBeenCalled();
            });

            it('should be redirected to strategies\' pages', () => {
                expect($location.path).toHaveBeenCalledWith('/strategies')
            });
        });
    });
});