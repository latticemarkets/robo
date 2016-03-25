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
    let $rootScope,
        $location,
        $window,
        $cookies,
        $http,
        $injector;

    beforeEach(() => {
        module('app');
        module($provide => {
            $provide.service('$cookies', () => ({
                    putObject: jasmine.createSpy('putObject'),
                    get: jasmine.createSpy('get'),
                    remove: jasmine.createSpy('remove'),
                    getObject: jasmine.createSpy('getObject')
            }));
            $provide.service('$window', () => ({
                    location: { href: '' }
            }));
        });
    });

    beforeEach(inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $http = $injector.get('$http');
    }));

    beforeEach(inject(function (_$location_, _$window_, _$cookies_) {
        $cookies = _$cookies_;
        $window = _$window_;
        $location = _$location_;
    }));

    describe('run security', () => {
        let token, email;
        beforeEach(() => {
            token = 'token';
            email = 'email';
            $cookies.getObject.and.returnValue({currentUser: {email: email, token: token}});
        });

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
            expect($cookies.putObject).toHaveBeenCalledWith('globals', {currentUser: {email: email, token: token}});
        });
    });

    describe('run location change start', () => {
        let token, email;
        beforeEach(() => {
            token = undefined;
            email = undefined;
            $rootScope.$broadcast('$locationChangeStart');
            $rootScope.globals = {currentUser: {email: email, token: token}};
            // $location.path() = '/signin';
            // $cookies.get() = 'connected';
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
            $rootScope.$broadcast('$locationChangeStart');
            $rootScope.globals = {currentUser: {email: email, token: token}};
            // $location.path() = '/signin';
            // $cookies.get() = 'notconnected';
        });

        it('should change locacation href', () => {
            expect($window.location.href).toBe('/?flag=unauthorized');
        });
    });

});
