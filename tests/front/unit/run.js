'use strict';

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

describe('module: app', function () {
    var $rootScope = undefined,
        responsiveService = undefined,
        $timeout = undefined;

    beforeEach(function () {
        module('app', function ($provide) {
            $provide.value('responsiveService', {
                adaptWrapperHeight: jasmine.createSpy('adaptWrapperHeight'),
                adaptSidebar: jasmine.createSpy('adaptSidebar')
            });
        });
        beforeEach(inject(function (_$rootScope_, _responsiveService_, _$timeout_) {
            $rootScope = _$rootScope_;
            responsiveService = _responsiveService_;
            $timeout = _$timeout_;
        }));
    });

    describe('run location change success', function () {

        beforeEach(function () {
            $rootScope.$broadcast('$locationChangeSuccess');
            $timeout.flush();
        });

        it('should call adaptWrapperHeight and adaptSidebar', function () {
            expect(responsiveService.adaptWrapperHeight).toHaveBeenCalled();
            expect(responsiveService.adaptSidebar).toHaveBeenCalled();
        });
    });
});
; /*
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

describe('module: app', function () {
    var $rootScope = undefined,
        $location = undefined,
        $window = undefined,
        $cookies = undefined,
        $http = undefined,
        $injector = undefined;

    beforeEach(function () {
        module('app');
        module(function ($provide) {
            $provide.service('$cookies', function () {
                return {
                    putObject: jasmine.createSpy('putObject'),
                    get: jasmine.createSpy('get'),
                    remove: jasmine.createSpy('remove'),
                    getObject: jasmine.createSpy('getObject')
                };
            });
        });
    });

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $http = $injector.get('$http');
    }));

    beforeEach(inject(function (_$location_, _$window_, _$cookies_) {
        $cookies = _$cookies_;
        $window = _$window_;
        $location = _$location_;
    }));

    describe('run security', function () {
        var token = undefined,
            email = undefined;
        beforeEach(function () {
            token = 'token';
            email = 'email';
            $rootScope.globals = { currentUser: { email: email, token: token } };
        });

        it('should store the email and token into the root scope', function () {
            expect($rootScope.globals.currentUser).toEqual({ email: email, token: token });
        });

        it('should sets the token as default http header', function () {
            expect($http.defaults.headers.common['X-TOKEN']).toBe(token);
        });

        it('should sets the email as default http header', function () {
            expect($http.defaults.headers.common['USER']).toBe(email);
        });

        it('should store the user\'s credentials in a cookie', function () {
            expect(_$cookies.putObject).toHaveBeenCalledWith('globals', { currentUser: { email: email, token: token } });
        });
    });

    describe('run location change start', function () {
        var token = undefined,
            email = undefined;
        beforeEach(function () {
            token = undefined;
            email = undefined;
            $rootScope.$broadcast('$locationChangeStart');
            $rootScope.globals = { currentUser: { email: email, token: token } };
            // $location.path() = '/signin';
            // $cookies.get() = 'connected';
        });

        it('should remove the "connected" cookie', function () {
            expect(_$cookies.remove).toHaveBeenCalledWith('connected');
        });

        it('should change locacation href', function () {
            expect($window.location.href).toHaveBeenCalledWith('/?flag=expired');
        });
    });

    describe('run location change start', function () {
        var token = undefined,
            email = undefined;
        beforeEach(function () {
            token = undefined;
            email = undefined;
            $rootScope.$broadcast('$locationChangeStart');
            $rootScope.globals = { currentUser: { email: email, token: token } };
            // $location.path() = '/signin';
            // $cookies.get() = 'notconnected';
        });

        it('should change locacation href', function () {
            expect($window.location.href).toHaveBeenCalledWith('/?flag=unauthorized');
        });
    });
});
