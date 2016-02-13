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

describe('RuleEditController', () => {
    let ruleEditController,
        cssInjector,
        $routeParams,
        constantsService,
        $location,
        authenticationService,
        userService;

    beforeEach(module('app'));

    beforeEach(() => {
        cssInjector = jasmine.createSpyObj('cssInjector', ['add']);
        $location = jasmine.createSpyObj('$location', ['path']);
        $routeParams = { platform: 'a' };

        authenticationService = jasmine.createSpyObj('authenticationService', ['getCurrentUsersEmail']);
        authenticationService.getCurrentUsersEmail.and.returnValue('toto@tata.fr');

        userService = jasmine.createSpyObj('userService', ['userData']);
        userService.userData.and.callFake((email, callback) => callback({data: {platforms: [{name: 'a', rules:[{id: "id1", name: 'rule1', pause: true}, {id: "id2", name: 'rule2', pause: false}, {id: "id3", name: 'rule3', pause: false}]}, {name: 'b', rules: [{pause: false}]}]}}));
    });

    describe('called with good platform and ruleId URL parameters', () => {
        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms']);
            constantsService.platforms.and.returnValue(['a']);
            $routeParams.ruleId = 'id1';
        });

        beforeEach(inject(($controller) => {
            ruleEditController = $controller('RuleEditController', {
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                userService: userService
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
                expect(ruleEditController.rule).toEqual({id: "id1", name: 'rule1', pause: true});
            });

            it('should call user service', () => {
                expect(userService.userData).toHaveBeenCalled();
            });

            it('should stop the spinner on success', () => {
                expect(ruleEditController.spinner).toBeFalsy();
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
            constantsService = jasmine.createSpyObj('constantsService', ['platforms']);
            constantsService.platforms.and.callFake(() => ['b']);
        });

        beforeEach(inject(($controller) => {
            ruleEditController = $controller('RuleEditController', {
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
                expect($location.path).toHaveBeenCalledWith('/strategies')
            });
        });
    });

    describe('called with good platform URL parameter but bad ruleId URL parameter', () => {
        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms']);
            constantsService.platforms.and.callFake(() => ['a']);
            $routeParams.ruleId = 'id1986859';
        });

        beforeEach(inject(($controller) => {
            ruleEditController = $controller('RuleEditController', {
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                userService: userService
            });
        }));

        describe('parameters test', () => {
            it('should get the platforms list from constant\'s service', () => {
                expect(constantsService.platforms).toHaveBeenCalled();
            });

            it('should be redirected to platform\'s page', () => {
                expect($location.path).toHaveBeenCalledWith('/strategies/rules/a');
            });
        });
    });

    describe('called with good platform URL parameter and no ruleId URL parameter', () => {
        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms']);
            constantsService.platforms.and.callFake(() => ['a']);
            $routeParams.ruleId = undefined;
        });

        beforeEach(inject(($controller) => {
            ruleEditController = $controller('RuleEditController', {
                cssInjector: cssInjector,
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                authenticationService: authenticationService,
                userService: userService
            });
        }));

        describe('parameters test', () => {
            it('should get the platforms list from constant\'s service', () => {
                expect(constantsService.platforms).toHaveBeenCalled();
            });

            it('should initialize a new rule object', () => {
                expect(ruleEditController.rule).toEqual({ name: jasmine.any(String), criteria: [] });
            });
        });
    });
});