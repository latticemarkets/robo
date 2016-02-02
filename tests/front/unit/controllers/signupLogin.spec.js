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
    let signUpController,
        userService,
        $cookieStore,
        $location,
        notificationService,
        notificationCallbackError;

    beforeEach(() => {
        module('app');

        userService = jasmine.createSpyObj('userService', ['isEmailUsed']);
        $cookieStore = jasmine.createSpyObj('$cookieStore', ['put']);
        $location = jasmine.createSpyObj('$location', ['path']);

        notificationCallbackError = jasmine.createSpy('notificationCallbackError');
        notificationService = {
            error: jasmine.createSpy('error'),
            apiError: () => notificationCallbackError
        };
    });

    beforeEach(inject(($controller) => {
        signUpController = $controller('SignupLoginController', {
            userService: userService,
            $cookieStore : $cookieStore,
            $location : $location,
            notificationService: notificationService
        });
    }));

    describe('transitions', () => {
        it('should specify the classes used for transition', () => {
            expect(signUpController.pageClass).toBe('signup-login blue');
        });
    });

    describe('submit with good parameters', () => {
        let emailUsedError;

        beforeEach(() => {
            emailUsedError = 'This email is already used.';
            signUpController.email = 'well@formed.fr';
            signUpController.password = 'Str0ngEnough';
        });

        it('should check if the email is already used', () => {
            signUpController.submit();
            expect(userService.isEmailUsed).toHaveBeenCalled();
        });

        describe('email not used', () => {
            beforeEach(() => {
                userService.isEmailUsed.and.callFake((email, success, error) => success({ data: { ok: true } }));
                signUpController.submit();
            });

            it('should add email and password to cookies', () => {
                expect($cookieStore.put).toHaveBeenCalledWith('signup.email', signUpController.email);
                expect($cookieStore.put).toHaveBeenCalledWith('signup.password', signUpController.password);
            });

            it('should move to terms and conditions page', () => {
                expect($location.path).toHaveBeenCalledWith('/signup/termsAndConditions');
            });
        });

        describe('email used', () => {
            beforeEach(() => {
                userService.isEmailUsed.and.callFake((email, success, error) => success({ data: { ok: false } }));
                signUpController.submit();
            });

            it('should display an error', () => {
                expect(notificationService.error).toHaveBeenCalledWith(emailUsedError);
            });

            it('should not add anything to cookies', () => {
                expect($cookieStore.put).not.toHaveBeenCalled();
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
                signUpController.submit();
            });

            it('should display an error this the message from the server', () => {
                expect(notificationCallbackError).toHaveBeenCalledWith(serverErrorObj);
            });

            it('should not add anything to cookies', () => {
                expect($cookieStore.put).not.toHaveBeenCalled();
            });

            it('should stay in the page', () => {
                expect($location.path).not.toHaveBeenCalled();
            });
        });
    });

    describe('submit with wrong parameters', () => {
        describe('good email - weak password', () => {
            beforeEach(() => {
                signUpController.email = 'well@formed.co.uk';
            });

            describe('no special char', () => testWrongPasswordFails('weakPassword'));
            describe('less than 8 characters', () => testWrongPasswordFails('wea9Pas'));
            describe('no uppercase', () => testWrongPasswordFails('wea9password'));
            describe('no lowercase', () => testWrongPasswordFails('WEA9PASSWORD'));
            describe('empty password', () => testWrongPasswordFails(''));

            function testWrongPasswordFails(password) {
                beforeEach(() => {
                    signUpController.password = password;
                    signUpController.submit();
                });

                it('should not submit the form', () => {
                    expect(userService.isEmailUsed).not.toHaveBeenCalled();
                });
            }
        });

        describe('bad email - weak password', () => {
            beforeEach(() => {
                signUpController.email = 'well@formed';
                signUpController.password = 'w';
                signUpController.submit();
            });

            it('should not submit the form', () => {
                expect(userService.isEmailUsed).not.toHaveBeenCalled();
            });
        });

        describe('bad email - good password', () => {
            beforeEach(() => {
                signUpController.password = 'Str0ngPassword';
            });

            describe('no domain extension', () => testWrongEmailFails('jack@bower'));
            describe('no domain', () => testWrongEmailFails('jack@.co.uk'));
            describe('no prefix', () => testWrongEmailFails('@bower.co.uk'));
            describe('no @', () => testWrongEmailFails('jackbower.co.uk'));

            function testWrongEmailFails(email) {
                beforeEach(() => {
                    signUpController.email = email;
                    signUpController.submit();
                });

                it('should not submit the form', () => {
                    expect(userService.isEmailUsed).not.toHaveBeenCalled();
                });
            }
        });
    });

    describe('password patterns', () => {
        describe('charLength', () => {
            it('should pass', () => {
                signUpController.password = 'Str0ngPassword';
                expect(signUpController.passwordPattern.charLength()).toBeTruthy();
            });

            it('should fail', () => {
                signUpController.password = 'Str0ng';
                expect(signUpController.passwordPattern.charLength()).toBeFalsy();
            });
        });

        describe('lowercase', () => {
            it('should pass', () => {
                signUpController.password = 'password';
                expect(signUpController.passwordPattern.lowercase()).toBeTruthy();
            });

            it('should fail', () => {
                signUpController.password = 'PASSWORD';
                expect(signUpController.passwordPattern.lowercase()).toBeFalsy();
            });
        });

        describe('uppercase', () => {
            it('should pass', () => {
                signUpController.password = 'PASSWORD';
                expect(signUpController.passwordPattern.uppercase()).toBeTruthy();
            });

            it('should fail', () => {
                signUpController.password = 'password';
                expect(signUpController.passwordPattern.uppercase()).toBeFalsy();
            });
        });

        describe('special', () => {
            it('should pass', () => {
                signUpController.password = '@';
                expect(signUpController.passwordPattern.special()).toBeTruthy();
            });

            it('should pass', () => {
                signUpController.password = '.';
                expect(signUpController.passwordPattern.special()).toBeTruthy();
            });

            it('should pass', () => {
                signUpController.password = '-';
                expect(signUpController.passwordPattern.special()).toBeTruthy();
            });

            it('should pass', () => {
                signUpController.password = '+';
                expect(signUpController.passwordPattern.special()).toBeTruthy();
            });

            it('should pass', () => {
                signUpController.password = ',';
                expect(signUpController.passwordPattern.special()).toBeTruthy();
            });

            it('should fail', () => {
                signUpController.password = 'password';
                expect(signUpController.passwordPattern.special()).toBeFalsy();
            });
        });
    });

    describe('tickBox', () => {
        describe('conditions fails', () => {
            it('should return unticked icon', () => {
                expect(signUpController.tickBox(() => false)).toBe('glyphicon-remove');
            });
        });

        describe('conditions passes', () => {
            it('should return a ticked icon', () => {
                expect(signUpController.tickBox(() => true)).toBe('glyphicon-ok');
            });
        });
    });
});