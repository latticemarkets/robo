/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 04/05/2016
*/

describe('Confirm Email Controller', () => {
    beforeEach(module('app'));

    let $location, userService;
    beforeEach(() => {
        $location = jasmine.createSpyObj('$location', ['path']);
        userService = jasmine.createSpyObj('userService', ['checkConfirmEmailToken']);
    });
    
    let confirmEmailController, $timeout;

    describe('with an well formed token that exist in the database', () => {
        beforeEach(() => {
            userService.checkConfirmEmailToken.and.callFake((token, okCallback, errorCallback) => okCallback());
        });

        beforeEach(inject(($controller, _$timeout_) => {
            confirmEmailController = $controller('ConfirmEmailController', {
                $routeParams: { token: '?foo' },
                $location: $location,
                $timeout: _$timeout_,
                userService: userService
            });
            $timeout = _$timeout_;
        }));

        it('should check the email using the API', () => {
            expect(userService.checkConfirmEmailToken).toHaveBeenCalled();
        });

        it('should redirect the user to sign in page after 3 seconds', () => {
            $timeout.flush();
            expect($location.path).toHaveBeenCalledWith('/signin');
        });
    });

    describe('with an well formed token that does NOT exist in the database', () => {
        beforeEach(() => {
            userService.checkConfirmEmailToken.and.callFake((token, okCallback, errorCallback) => errorCallback());
        });

        beforeEach(inject(($controller, _$timeout_) => {
            confirmEmailController = $controller('ConfirmEmailController', {
                $routeParams: { token: '?foo' },
                $location: $location,
                $timeout: _$timeout_,
                userService: userService
            });
            $timeout = _$timeout_;
        }));

        it('should check the email using the API', () => {
            expect(userService.checkConfirmEmailToken).toHaveBeenCalled();
        });

        it('should redirect the user to 404 page', () => {
            expect($location.path).toHaveBeenCalledWith('/404');
        });
    });

    describe('with no argument', () => {
        beforeEach(() => {
            userService.checkConfirmEmailToken.and.callFake((token, okCallback, errorCallback) => errorCallback());
        });

        beforeEach(inject(($controller, _$timeout_) => {
            confirmEmailController = $controller('ConfirmEmailController', {
                $routeParams: { token: '' },
                $location: $location,
                $timeout: _$timeout_,
                userService: userService
            });
            $timeout = _$timeout_;
        }));

        it('should check the email using the API', () => {
            expect(userService.checkConfirmEmailToken).toHaveBeenCalled();
        });

        it('should redirect the user to 404 page', () => {
            expect($location.path).toHaveBeenCalledWith('/404');
        });
    });

    describe('with no argument', () => {
        beforeEach(() => {
            userService.checkConfirmEmailToken.and.callFake((token, okCallback, errorCallback) => errorCallback());
        });

        beforeEach(inject(($controller, _$timeout_) => {
            confirmEmailController = $controller('ConfirmEmailController', {
                $routeParams: { token: '?' },
                $location: $location,
                $timeout: _$timeout_,
                userService: userService
            });
            $timeout = _$timeout_;
        }));

        it('should check the email using the API', () => {
            expect(userService.checkConfirmEmailToken).toHaveBeenCalled();
        });

        it('should redirect the user to 404 page', () => {
            expect($location.path).toHaveBeenCalledWith('/404');
        });
    });
});