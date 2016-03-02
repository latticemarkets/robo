/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 29/01/2016
*/

describe('SignupLoginController', () => {
    let signUpLoginController,
        userService,
        $cookies,
        $location,
        notificationService,
        notificationCallbackError,
        patternCheckerService;

    beforeEach(() => {
        module('app');

        userService = jasmine.createSpyObj('userService', ['isEmailUsed']);
        $cookies = jasmine.createSpyObj('$cookies', ['put']);
        $location = jasmine.createSpyObj('$location', ['path']);
        patternCheckerService = jasmine.createSpyObj('patternCheckerService', ['isEmail', 'charLengthGreaterThan8', 'hasLowercase', 'hasUppercase', 'hasSpecialChar']);

        notificationCallbackError = jasmine.createSpy('notificationCallbackError');
        notificationService = {
            error: jasmine.createSpy('error'),
            apiError: () => notificationCallbackError
        };
    });

    beforeEach(inject(($controller) => {
        signUpLoginController = $controller('SignupLoginController', {
            userService: userService,
            $cookies : $cookies,
            $location : $location,
            notificationService: notificationService,
            patternCheckerService: patternCheckerService
        });
    }));

    describe('transitions', () => {
        it('should specify the classes used for transition', () => {
            expect(signUpLoginController.pageClass).toBe('signup-login blue');
        });
    });

    describe('submit with good parameters', () => {
        let emailUsedError;

        beforeEach(() => {
            emailUsedError = 'This email is already used.';
            signUpLoginController.email = 'well@formed.fr';
            signUpLoginController.password = 'Str0ngEnough';

            patternCheckerService.isEmail.and.callFake(() => true);
            patternCheckerService.charLengthGreaterThan8.and.callFake(() => true);
            patternCheckerService.hasLowercase.and.callFake(() => true);
            patternCheckerService.hasUppercase.and.callFake(() => true);
            patternCheckerService.hasSpecialChar.and.callFake(() => true);
        });

        it('should check if the email is already used', () => {
            signUpLoginController.submit();
            expect(userService.isEmailUsed).toHaveBeenCalled();
        });

        describe('email not used', () => {
            beforeEach(() => {
                userService.isEmailUsed.and.callFake((email, success, error) => success({ data: { ok: true } }));
                signUpLoginController.submit();
            });

            it('should add email and password to cookies', () => {
                expect($cookies.put).toHaveBeenCalledWith('signup.email', signUpLoginController.email);
                expect($cookies.put).toHaveBeenCalledWith('signup.password', signUpLoginController.password);
            });

            it('should move to terms and conditions page', () => {
                expect($location.path).toHaveBeenCalledWith('/signup/termsAndConditions');
            });
        });

        describe('email used', () => {
            beforeEach(() => {
                userService.isEmailUsed.and.callFake((email, success, error) => success({ data: { ok: false } }));
                signUpLoginController.submit();
            });

            it('should display an error', () => {
                expect(notificationService.error).toHaveBeenCalledWith(emailUsedError);
            });

            it('should not add anything to cookies', () => {
                expect($cookies.put).not.toHaveBeenCalled();
            });

            it('should stay in the page', () => {
                expect($location.path).not.toHaveBeenCalled();
            });
        });

        describe('error returned', () => {
            var serverErrorObj;
            beforeEach(() => {
                serverErrorObj = { data: jasmine.any(String) };
                userService.isEmailUsed.and.callFake((email, success, error) => error(serverErrorObj));
                signUpLoginController.submit();
            });

            it('should display an error this the message from the server', () => {
                expect(notificationCallbackError).toHaveBeenCalledWith(serverErrorObj);
            });

            it('should not add anything to cookies', () => {
                expect($cookies.put).not.toHaveBeenCalled();
            });

            it('should stay in the page', () => {
                expect($location.path).not.toHaveBeenCalled();
            });
        });
    });

    describe('submit with wrong parameters', () => {
        describe('good email - weak password', () => {
            beforeEach(() => {
                patternCheckerService.isEmail.and.callFake(() => true);
            });

            describe('no special char', () => {
                beforeEach(() => {
                    patternCheckerService.charLengthGreaterThan8.and.callFake(() => true);
                    patternCheckerService.hasLowercase.and.callFake(() => true);
                    patternCheckerService.hasUppercase.and.callFake(() => true);
                    patternCheckerService.hasSpecialChar.and.callFake(() => false);
                });

                it('should not submit the form', () => {
                    signUpLoginController.submit();
                    expect(userService.isEmailUsed).not.toHaveBeenCalled();
                });
            });
            describe('less than 8 characters', () => {
                beforeEach(() => {
                    patternCheckerService.charLengthGreaterThan8.and.callFake(() => false);
                    patternCheckerService.hasLowercase.and.callFake(() => true);
                    patternCheckerService.hasUppercase.and.callFake(() => true);
                    patternCheckerService.hasSpecialChar.and.callFake(() => true);
                });

                it('should not submit the form', () => {
                    signUpLoginController.submit();
                    expect(userService.isEmailUsed).not.toHaveBeenCalled();
                });
            });
            describe('no uppercase', () => {
                beforeEach(() => {
                    patternCheckerService.charLengthGreaterThan8.and.callFake(() => true);
                    patternCheckerService.hasLowercase.and.callFake(() => true);
                    patternCheckerService.hasUppercase.and.callFake(() => false);
                    patternCheckerService.hasSpecialChar.and.callFake(() => true);
                });

                it('should not submit the form', () => {
                    signUpLoginController.submit();
                    expect(userService.isEmailUsed).not.toHaveBeenCalled();
                });
            });
            describe('no lowercase', () => {
                beforeEach(() => {
                    patternCheckerService.charLengthGreaterThan8.and.callFake(() => true);
                    patternCheckerService.hasLowercase.and.callFake(() => false);
                    patternCheckerService.hasUppercase.and.callFake(() => true);
                    patternCheckerService.hasSpecialChar.and.callFake(() => true);
                });

                it('should not submit the form', () => {
                    signUpLoginController.submit();
                    expect(userService.isEmailUsed).not.toHaveBeenCalled();
                });
            });
            describe('empty password', () => {
                beforeEach(() => {
                    patternCheckerService.charLengthGreaterThan8.and.callFake(() => false);
                    patternCheckerService.hasLowercase.and.callFake(() => true);
                    patternCheckerService.hasUppercase.and.callFake(() => true);
                    patternCheckerService.hasSpecialChar.and.callFake(() => true);
                });

                it('should not submit the form', () => {
                    signUpLoginController.submit();
                    expect(userService.isEmailUsed).not.toHaveBeenCalled();
                });
            });
        });

        describe('bad email - weak password', () => {
            beforeEach(() => {
                patternCheckerService.isEmail.and.callFake(() => false);
                patternCheckerService.charLengthGreaterThan8.and.callFake(() => false);
                patternCheckerService.hasLowercase.and.callFake(() => false);
                patternCheckerService.hasUppercase.and.callFake(() => true);
                patternCheckerService.hasSpecialChar.and.callFake(() => true);
                signUpLoginController.submit();
            });

            it('should not submit the form', () => {
                expect(userService.isEmailUsed).not.toHaveBeenCalled();
            });
        });

        describe('bad email - good password', () => {
            beforeEach(() => {
                patternCheckerService.isEmail.and.callFake(() => false);
                patternCheckerService.charLengthGreaterThan8.and.callFake(() => true);
                patternCheckerService.hasLowercase.and.callFake(() => true);
                patternCheckerService.hasUppercase.and.callFake(() => true);
                patternCheckerService.hasSpecialChar.and.callFake(() => true);

                signUpLoginController.submit();
            });

            it('should not submit the form', () => {
                expect(userService.isEmailUsed).not.toHaveBeenCalled();
            });
        });
    });

    describe('tickBox', () => {
        describe('conditions fails', () => {
            it('should return unticked icon', () => {
                expect(signUpLoginController.tickBox(() => false)).toBe('glyphicon-remove');
            });
        });

        describe('conditions passes', () => {
            it('should return a ticked icon', () => {
                expect(signUpLoginController.tickBox(() => true)).toBe('glyphicon-ok');
            });
        });
    });
});