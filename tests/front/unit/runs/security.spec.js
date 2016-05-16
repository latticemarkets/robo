/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
 * @author : bastienguerineau
 * Created on 17/03/2016
 */

describe('run : security', function () {
    let $location,
        $window,
        $cookies,
        $http,
        $injector,
        $rootScope;

    let token, email, $cookiesObj;
    beforeEach(() => {
        token = 'token';
        email = 'email';
        $cookiesObj = {
            putObject: jasmine.createSpy('putObject'),
            get: jasmine.createSpy('get'),
            remove: jasmine.createSpy('remove'),
            getObject: jasmine.createSpy('getObject')
        };
        $cookiesObj.getObject.and.returnValue({currentUser: {email: email, token: token}});
    });

    beforeEach(() => {
        module('app');
        module($provide => {
            $provide.service('$cookies', () => $cookiesObj);

            $provide.service('$window', () => ({
                location: { href: '' }
            }));

            $provide.service('$http', () => ({
                defaults: { headers: { common : {} } }
            }));

            $provide.service('$location', () => ({
                path: jasmine.createSpy('path')
            }));
        });
    });

    beforeEach(inject(( _$rootScope_, _$location_, _$window_, _$cookies_, _$http_) => {
        $cookies = _$cookies_;
        $window = _$window_;
        $location = _$location_;
        $http = _$http_;
        $rootScope = _$rootScope_;
    }));

    describe('get user credentials', () => {
        it('should store the email and token into the root scope', () => {
            expect($rootScope.globals.currentUser).toEqual({email: email, token: token});
        });

        it('should sets the token as default http header', () => {
            expect($http.defaults.headers.common['X-TOKEN']).toBe(token);
        });

        it('should sets the email as default http header', () => {
            expect($http.defaults.headers.common['USER']).toBe(email);
        });

        it('should store the user\'s credentials in a cookie', () => {
            expect($cookies.putObject).toHaveBeenCalledWith('globals', { currentUser: {email: email, token: token}}, jasmine.any(Object));
        });
    });

    describe('on location change start', () => {
        describe('on authorized page and not logged in', () => {
            beforeEach(() => {
                $location.path.and.returnValue('/signin');
                $rootScope.globals.currentUser = '';
                $rootScope.$broadcast('$locationChangeStart');
            });

            nothingCalled();
        });

        describe('on authorized page with url params and not logged in', () => {
            beforeEach(() => {
                $location.path.and.returnValue('/reinitializePassword/?an-awesome-token');
                $rootScope.globals.currentUser = '';
                $rootScope.$broadcast('$locationChangeStart');
            });
            
            nothingCalled();
        });
        
        describe('on authorized page and logged in', () => {
            beforeEach(() => {
                $location.path.and.returnValue('/signin');
                $rootScope.globals.currentUser = {email: email, token: token};
                $rootScope.$broadcast('$locationChangeStart');
            });

            nothingCalled();
        });

        describe('on unauthorized page and logged in', () => {
            beforeEach(() => {
                $location.path.and.returnValue('/dashboard');
                $rootScope.globals.currentUser = {email: email, token: token};
                $rootScope.$broadcast('$locationChangeStart');
            });

            nothingCalled();
        });

        describe('on unauthorized page and not logged in', () => {
            describe('and the route exists', () => {
                describe('and the user\'s session expired', () => {
                    beforeEach(() => {
                        $location.path.and.returnValue('/dashboard');
                        $rootScope.globals.currentUser = undefined;
                        $cookies.get.and.returnValue(true);
                        $rootScope.$broadcast('$locationChangeStart');
                    });

                    it('should remove the session flag', () => {
                        expect($cookies.remove).toHaveBeenCalledWith('connected');
                    });

                    it('should redirect the user to the landpage with the "expired" flag', () => {
                        expect($window.location.href).toBe("/?flag=expired");
                    });
                });

                describe('and the user\'s session did not expired', () => {
                    beforeEach(() => {
                        $location.path.and.returnValue('/dashboard');
                        $rootScope.globals.currentUser = undefined;
                        $cookies.get.and.returnValue(false);
                        $rootScope.$broadcast('$locationChangeStart');
                    });

                    it('should redirect the user to the landpage with the "unauthorized" flag', () => {
                        expect($window.location.href).toBe("/?flag=unauthorized");
                    });
                });
            });

            describe('and the route does not exist', () => {
                beforeEach(() => {
                    $location.path.and.returnValue('/dashb0ard');
                    $rootScope.globals.currentUser = undefined;
                    $rootScope.$broadcast('$locationChangeStart');
                });

                it('should redirect the user to 404 page', () => {
                    expect($location.path).toHaveBeenCalledWith('/404');
                });
            });
        });

        function nothingCalled() {
            it('should not remove the "connected" cookie', () => {
                expect($cookies.remove).not.toHaveBeenCalled();
            });

            it('should not change the url', () => {
                expect($window.location.href).toBe('');
            });

            it('should not redirect the user', () => {
                expect($location.path).not.toHaveBeenCalledWith('/404');
            });
        }
    });
});
