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

            $provide.service('$injector', () => ({
                invoke: jasmine.createSpy('invoke')
            }));

            $provide.service('$http', () => ({
                defaults: { headers: { common : {} } }
            }));
        });
    });

    beforeEach(inject(( _$rootScope_, _$location_, _$window_, _$cookies_, _$http_, _$injector_) => {
        $cookies = _$cookies_;
        $window = _$window_;
        $location = _$location_;
        $injector = _$injector_;
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

    describe('run location change start', () => {
        let token, email;
        beforeEach(() => {
            token = undefined;
            email = undefined;
            $rootScope.$broadcast('$locationChangeStart');
        });

        it('should remove the "connected" cookie', () => {
            expect($cookies.remove).toHaveBeenCalledWith('connected');
        });

        it('should change locacation href', () => {
            expect($window.location.href).toBe('/?flag=expired');
        });
    });

    describe('run location change start', () => {
        let token, email;
        beforeEach(() => {
            token = undefined;
            email = undefined;
        });

        it('should change locacation href', () => {
            expect($window.location.href).toBe('/?flag=unauthorized');
        });
    });

});
