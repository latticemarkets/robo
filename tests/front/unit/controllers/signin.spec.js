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
    let signInController,
        userService,
        $cookieStore,
        $location,
        authenticationService;

    beforeEach(() => {
        module('app');

        userService = jasmine.createSpyObj('userService', ['login']);
        $cookieStore = jasmine.createSpyObj('$cookieStore', ['put']);
        $location = jasmine.createSpyObj('$location', ['path']);
        authenticationService = jasmine.createSpyObj('authenticationService', ['authenticate']);
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