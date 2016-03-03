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
        $cookies,
        $location,
        userService,
        notificationService,
        authenticationService;

    beforeEach(() => {
        module('app');

        $cookies = jasmine.createSpyObj('$cookies', ['get', 'put', 'remove', 'getObject']);
        $location = jasmine.createSpyObj('$location', ['path']);
        userService = jasmine.createSpyObj('userService', ['register']);
        notificationService = jasmine.createSpyObj('notificationService', ['apiError']);
        authenticationService = jasmine.createSpyObj('authenticationService', ['authenticate']);
    });

    beforeEach(inject(($controller) => {
        personalInfosController = $controller('SignupPersonalInfosController', {
            $cookies : $cookies,
            $location : $location,
            userService: userService,
            notificationService: notificationService,
            authenticationService: authenticationService
        });
    }));

    describe('initialization', () => {
        describe('data are present', () => {
            beforeEach(() => {
                $cookies.get.and.callFake(() => jasmine.any(String));
                $cookies.getObject.and.callFake(() => jasmine.any(String));
            });

            it('should get previous data', () => {
                expect($cookies.get).toHaveBeenCalledWith('signup.email');
                expect($cookies.get).toHaveBeenCalledWith('signup.password');
                expect($cookies.get).toHaveBeenCalledWith('signup.terms');
                expect($cookies.get).toHaveBeenCalledWith('signup.reason');
                expect($cookies.get).toHaveBeenCalledWith('signup.income');
                expect($cookies.get).toHaveBeenCalledWith('signup.timeline');
                expect($cookies.get).toHaveBeenCalledWith('signup.birthday');
                expect($cookies.getObject).toHaveBeenCalledWith('signup.platforms');
            });
        });

        describe('data are NOT present', () => {
            beforeEach(() => {
                $cookies.get.and.callFake(() => undefined);
                $cookies.getObject.and.callFake(() => undefined);
            });

            it('go back to first registration page', () => {
                expect($cookies.get).toHaveBeenCalledWith('signup.email');
                expect($cookies.get).toHaveBeenCalledWith('signup.password');
                expect($cookies.get).toHaveBeenCalledWith('signup.terms');
                expect($cookies.get).toHaveBeenCalledWith('signup.reason');
                expect($cookies.get).toHaveBeenCalledWith('signup.income');
                expect($cookies.get).toHaveBeenCalledWith('signup.timeline');
                expect($cookies.get).toHaveBeenCalledWith('signup.birthday');
                expect($cookies.getObject).toHaveBeenCalledWith('signup.platforms');
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
                         platforms,
                         firstName,
                         lastName,
                         successCallback,
                         errorCallback) => successCallback({ data: { token: token } })
                    );

                    personalInfosController.submit();
                });

                it('should authenticate the user', () => {
                    expect(authenticationService.authenticate).toHaveBeenCalled();
                });

                it('should remove cookies used in registering process', () => {
                    expect($cookies.remove).toHaveBeenCalledWith('signup.email');
                    expect($cookies.remove).toHaveBeenCalledWith('signup.password');
                    expect($cookies.remove).toHaveBeenCalledWith('signup.terms');
                    expect($cookies.remove).toHaveBeenCalledWith('signup.reason');
                    expect($cookies.remove).toHaveBeenCalledWith('signup.income');
                    expect($cookies.remove).toHaveBeenCalledWith('signup.timeline');
                    expect($cookies.remove).toHaveBeenCalledWith('signup.birthday');
                    expect($cookies.remove).toHaveBeenCalledWith('signup.originator');
                    expect($cookies.remove).toHaveBeenCalledWith('signup.platforms');
                });

                it('should go to success register page', () => {
                    expect($location.path).toHaveBeenCalledWith('/signup/registered');
                });

                it('should insert api error callback', () => {
                    expect(notificationService.apiError).toHaveBeenCalled();
                });
            });

            describe('data insertion failed', () => {
                beforeEach(() => {
                    personalInfosController.submit();
                });

                it('should not add any token to cookies', () => {
                    expect($cookies.put).not.toHaveBeenCalled();
                });

                it('should not remove cookies used in registering process', () => {
                    expect($cookies.remove).not.toHaveBeenCalled();
                });

                it('should stay on the current page', () => {
                    expect($location.path).not.toHaveBeenCalledWith('/signup/registered');
                });

                it('should insert api error callback', () => {
                    expect(notificationService.apiError).toHaveBeenCalled();
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

                it('should not insert api error callback', () => {
                    expect(notificationService.apiError).not.toHaveBeenCalled();
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

                it('should not insert api error callback', () => {
                    expect(notificationService.apiError).not.toHaveBeenCalled();
                });
            });
        });
    });
});
