/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
 * @author : julienderay
 * Created on 30/01/2016
 */

describe('authenticationService', () => {
    let _authenticationService,
        _$cookieStore,
        $rootScope,
        $http;

    beforeEach(() => {
        module('app');
        module($provide => {
            $provide.service('$cookieStore', () => {
                return {
                    put: jasmine.createSpy('put'),
                    remove: jasmine.createSpy('remove'),
                    get: jasmine.createSpy('get')
                };
            });
        });
    });

    beforeEach(inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $http = $injector.get('$http');
    }));

    beforeEach(inject((authenticationService, $cookieStore) => {
        _authenticationService = authenticationService;
        _$cookieStore = $cookieStore;
    }));

    describe('authenticate', () => {
        let token, email;

        beforeEach(() => {
            token = 'token';
            email = 'email';
            _authenticationService.authenticate(token, email)
        });

        it('should store the email and token into the root scope', () => {
            expect($rootScope.globals.currentUser).toEqual({ email: email, token: token });
        });

        it('should sets the token as default http header', () => {
            expect($http.defaults.headers.common['X-TOKEN']).toBe(token);
        });

        it('should sets the email as default http header', () => {
            expect($http.defaults.headers.common['USER']).toBe(email);
        });

        it('should store the user\'s credentials in a cookie', () => {
            expect(_$cookieStore.put).toHaveBeenCalledWith('globals', { currentUser: { email: email, token: token } });
        });
    });

    describe('logout', () => {
        beforeEach(() => {
            _authenticationService.logout();
        });

        it('should wipe user\'s credentials in the rootScope', () => {
            expect($rootScope.globals).toEqual({});
        });

        it('should remove the token from default http headers', () => {
            expect($http.defaults.headers.common['X-TOKEN']).toBe('');
        });

        it('should remove the email from default http headers', () => {
            expect($http.defaults.headers.common['USER']).toBe('');
        });

        it('should remove the user\'s credentials from the cookies', () => {
            expect(_$cookieStore.remove).toHaveBeenCalledWith('globals');
        });
    });

    describe('getCurrentUsersEmail', () => {
        let email;

        describe('user connected', () => {
            beforeEach(() => {
                email = "email";
                $rootScope.globals = { currentUser : { email: email } };
            });

            it('should return the current user\'s email', () => {
                expect(_authenticationService.getCurrentUsersEmail()).toBe(email);
            });
        });

        describe('user not connected', () => {
            describe('email not set', () => {
                beforeEach(() => {
                    email = undefined;
                    $rootScope.globals = { currentUser : { email: email } };
                });

                it('should return the current user\'s email', () => {
                    expect(_authenticationService.getCurrentUsersEmail()).toBeUndefined();
                });
            });

            describe('current user not set', () => {
                beforeEach(() => {
                    $rootScope.globals = { currentUser : undefined };
                });

                it('should return the current user\'s email', () => {
                    expect(_authenticationService.getCurrentUsersEmail()).toBeUndefined();
                });
            });
        });
    });

    describe('getCurrentUsersToken', () => {
        let token;

        describe('user connected', () => {
            beforeEach(() => {
                token = "token";
                $rootScope.globals = { currentUser : { token: token } };
            });

            it('should return the current user\'s token', () => {
                expect(_authenticationService.getCurrentUsersToken()).toBe(token);
            });
        });

        describe('user not connected', () => {
            describe('token not set', () => {
                beforeEach(() => {
                    token = undefined;
                    $rootScope.globals = { currentUser : { token: token } };
                });

                it('should return the current user\'s token', () => {
                    expect(_authenticationService.getCurrentUsersToken()).toBeUndefined();
                });
            });

            describe('current user not set', () => {
                beforeEach(() => {
                    $rootScope.globals = { currentUser : undefined };
                });

                it('should return the current user\'s token', () => {
                    expect(_authenticationService.getCurrentUsersToken()).toBeUndefined();
                });
            });
        });
    });
});