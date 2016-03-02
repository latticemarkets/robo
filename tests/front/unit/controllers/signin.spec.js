/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
 * @author : julienderay
 * Created on 28/01/2016
 */

"use strict";

describe('SignInController', () => {
    beforeEach(() => {
        module('app');
    });

    describe('initialization', () => {
        let signInController,
            userService,
            authenticationService,
            $location;

        beforeEach(() => {
            userService = jasmine.createSpyObj('userService', ['checkUserToken']);
            authenticationService = jasmine.createSpyObj('authenticationService', ['getCurrentUsersEmail', 'getCurrentUsersToken']);
            $location = jasmine.createSpyObj('$location', ['path']);
        });

        describe('the user has connection data stored as cookie', () => {
            beforeEach(() => {
                authenticationService.getCurrentUsersEmail.and.returnValue('em@il.co.uk');
                authenticationService.getCurrentUsersToken.and.returnValue('myToken');
            });

            let checkUserTokenCallback;
            beforeEach(() => {
                userService.checkUserToken.and.callFake((email, token, callback) => checkUserTokenCallback = callback);
            });

            beforeEach(inject(($controller) => {
                signInController = $controller('SignInController', {
                    userService: userService,
                    $location : $location,
                    authenticationService: authenticationService
                });
            }));

            describe('check user\'s token', () => {
                describe('when the token is ok', () => {
                    beforeEach(() => {
                        checkUserTokenCallback();
                    });

                    it('should redirect the user to his dashboard', () => {
                        expect($location.path).toHaveBeenCalledWith('/dashboard');
                    });
                });
            });
        });

        describe('the user do not have connection data stored as cookie', () => {
            beforeEach(() => {
                authenticationService.getCurrentUsersEmail.and.returnValue(undefined);
                authenticationService.getCurrentUsersToken.and.returnValue(undefined);
            });

            beforeEach(inject(($controller) => {
                signInController = $controller('SignInController', {
                    userService: userService,
                    $location : $location,
                    authenticationService: authenticationService
                });
            }));

            it('should not check any token and let the user log in', () => {
                expect(userService.checkUserToken).not.toHaveBeenCalled();
            });
        });
    });

    describe('methods', () => {
        let signInController,
            userService,
            $cookieStore,
            $location,
            authenticationService;

        beforeEach(() => {
            userService = jasmine.createSpyObj('userService', ['login', 'checkUserToken']);
            $cookieStore = jasmine.createSpyObj('$cookieStore', ['put']);
            $location = jasmine.createSpyObj('$location', ['path']);
            authenticationService = jasmine.createSpyObj('authenticationService', ['authenticate', 'getCurrentUsersEmail', 'getCurrentUsersToken']);
        });

        beforeEach(inject(($controller) => {
            signInController = $controller('SignInController', {
                userService: userService,
                $cookieStore : $cookieStore,
                $location : $location,
                authenticationService: authenticationService
            });
        }));

        describe('login with good parameters', () => {
            beforeEach(() => {
                signInController.email = "well@formed.fr";
                signInController.password = "Str0ngEnough";
            });

            it('should submit the form', () => {
                signInController.submit();

                expect(userService.login).toHaveBeenCalled();
            });

            describe('success callback', () => {
                let token;

                beforeEach(() => {
                    token = jasmine.any(String);

                    userService.login.and.callFake((email, password, success) => {
                        success({ data: { token: token } });
                    });
                    signInController.submit();
                });

                it('should add the returned token as cookie', () => {
                    expect(authenticationService.authenticate).toHaveBeenCalledWith(token, signInController.email);
                });

                it('should go to the dashboard', () => {
                    expect($location.path).toHaveBeenCalledWith('/dashboard');
                });
            });
        });

        describe('login with wrong parameters', () => {
            beforeEach(() => {
                signInController.password = "Str0ngEnough";
            });

            describe('email with no domain extension', () => {
                testWithEmail("notWell@formed");
            });

            describe('email with no domain', () => {
                testWithEmail("notWell@.fr");
            });

            describe('email with no @', () => {
                testWithEmail("notWellformed.fr");
            });

            describe('email with no prefix', () => {
                testWithEmail("@formed.fr");
            });

            describe('email with special char', () => {
                testWithEmail("pasBienFormé@formed.fr");
            });

            function testWithEmail(email) {
                beforeEach(() => {
                    signInController.email = email;
                    signInController.submit();
                });

                it('should not submit the form', () => {
                    expect(userService.login).not.toHaveBeenCalled();
                });
            }
        });
    });
});