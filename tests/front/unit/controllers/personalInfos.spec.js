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

describe('SignupPersonalInfosController', () => {
    let personalInfosController,
        $cookieStore,
        $location,
        userService,
        notificationService;

    beforeEach(() => {
        module('app');

        $cookieStore = jasmine.createSpyObj('$cookieStore', ['get', 'put', 'remove']);
        $location = jasmine.createSpyObj('$location', ['path']);
        userService = jasmine.createSpyObj('userService', ['register']);
        notificationService = jasmine.createSpyObj('notificationService', ['error']);
    });

    beforeEach(inject(($controller) => {
        personalInfosController = $controller('SignupPersonalInfosController', {
            $cookieStore : $cookieStore,
            $location : $location,
            userService: userService,
            notificationService: notificationService
        });
    }));

    describe('initialization', () => {
        describe('data are present', () => {
            beforeEach(() => {
                $cookieStore.get.and.callFake(() => jasmine.any(String));
            });

            it('should get previous data', () => {
                expect($cookieStore.get).toHaveBeenCalledWith('signup.email');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.password');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.terms');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.reason');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.income');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.timeline');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.birthday');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.platform');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.accountId');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.apiKey');
            });
        });

        describe('data are NOT present', () => {
            beforeEach(() => {
                $cookieStore.get.and.callFake(() => undefined);
            });

            it('go back to first registration page', () => {
                expect($cookieStore.get).toHaveBeenCalledWith('signup.email');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.password');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.terms');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.reason');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.income');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.timeline');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.birthday');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.platform');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.accountId');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.apiKey');
                expect($location.path).toHaveBeenCalledWith('/signup');
            });
        });
    });

    describe('disableSubmitButton', () => {
        describe('with good values', () => {
            beforeEach(() => {
                personalInfosController.firstName = "arthur";
                personalInfosController.lastName = "guinness";
            });

            it('should not disable the buttons', () => {
                expect(personalInfosController.disableSubmitButton(() => false)).toBeFalsy();
            });
        });

        describe('with bad values', () => {
            describe('empty accountId', () => {
                beforeEach(() => {
                    personalInfosController.firstName = "arthur";
                    personalInfosController.lastName = undefined;
                });

                it('should disable the buttons', () => {
                    expect(personalInfosController.disableSubmitButton(() => true)).toBeTruthy();
                });
            });

            describe('empty API key', () => {
                beforeEach(() => {
                    personalInfosController.firstName = undefined;
                    personalInfosController.lastName = "guinness";
                });

                it('should disable the buttons', () => {
                    expect(personalInfosController.disableSubmitButton(() => true)).toBeTruthy();
                });
            });
        });
    });

    describe('submit', () => {
        describe('with good values', () => {
            beforeEach(() => {
                personalInfosController.firstName = "arthur";
                personalInfosController.lastName = "guinness";
            });

            describe('data successfully inserted', () => {
                let token;

                beforeEach(() => {
                    token = '12345';

                    userService.register.and.callFake(
                        (email,
                         password,
                         terms,
                         reason,
                         income,
                         timeline,
                         birthday,
                         platform,
                         accountId,
                         apiKey,
                         firstName,
                         lastName,
                         successCallback,
                         errorCallback) => successCallback({ data: { token: token } })
                    );

                    personalInfosController.submit();
                });

                it('should add token to cookies', () => {
                    expect($cookieStore.put).toHaveBeenCalledWith('token', token);
                });

                it('should remove cookies used in registering process', () => {
                    expect($cookieStore.remove).toHaveBeenCalledWith('signup.email');
                    expect($cookieStore.remove).toHaveBeenCalledWith('signup.password');
                    expect($cookieStore.remove).toHaveBeenCalledWith('signup.terms');
                    expect($cookieStore.remove).toHaveBeenCalledWith('signup.reason');
                    expect($cookieStore.remove).toHaveBeenCalledWith('signup.income');
                    expect($cookieStore.remove).toHaveBeenCalledWith('signup.timeline');
                    expect($cookieStore.remove).toHaveBeenCalledWith('signup.birthday');
                    expect($cookieStore.remove).toHaveBeenCalledWith('signup.platform');
                    expect($cookieStore.remove).toHaveBeenCalledWith('signup.accountId');
                    expect($cookieStore.remove).toHaveBeenCalledWith('signup.apiKey');
                });

                it('should go to success register page', () => {
                    expect($location.path).toHaveBeenCalledWith('/signup/registered');
                });

                it('should not display any error message', () => {
                    expect(notificationService.error).not.toHaveBeenCalled();
                });
            });

            describe('data insertion failed', () => {
                let errorMessage;

                beforeEach(() => {
                    errorMessage = "error";

                    userService.register.and.callFake(
                        (email,
                         password,
                         terms,
                         reason,
                         income,
                         timeline,
                         birthday,
                         platform,
                         accountId,
                         apiKey,
                         firstName,
                         lastName,
                         successCallback,
                         errorCallback) => errorCallback({ data: errorMessage })
                    );

                    personalInfosController.submit();
                });

                it('should not add any token to cookies', () => {
                    expect($cookieStore.put).not.toHaveBeenCalled();
                });

                it('should not remove cookies used in registering process', () => {
                    expect($cookieStore.remove).not.toHaveBeenCalled();
                });

                it('should stay on the current page', () => {
                    expect($location.path).not.toHaveBeenCalledWith('/signup/registered');
                });

                it('should display any error message', () => {
                    expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
                });
            });
        });

        describe('with bad values', () => {
            describe('empty last name', () => {
                beforeEach(() => {
                    personalInfosController.firstName = "arthur";
                    personalInfosController.lastName = undefined;
                    personalInfosController.submit();
                });

                it('should not call register', () => {
                    expect(userService.register).not.toHaveBeenCalled();
                });
            });

            describe('empty first name', () => {
                beforeEach(() => {
                    personalInfosController.firstName = undefined;
                    personalInfosController.lastName = "guinness";
                    personalInfosController.submit();
                });

                it('should not call register', () => {
                    expect(userService.register).not.toHaveBeenCalled();
                });
            });
        });
    });
});