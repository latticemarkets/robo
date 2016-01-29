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

describe('SignupP2pPlatformController', () => {
    let p2pPlatformController,
        $cookieStore,
        $location;

    beforeEach(() => {
        module('app');

        $cookieStore = jasmine.createSpyObj('$cookieStore', ['get', 'put']);
        $location = jasmine.createSpyObj('$location', ['path']);
    });

    beforeEach(inject(($controller) => {
        p2pPlatformController = $controller('SignupP2pPlatformController', {
            $cookieStore : $cookieStore,
            $location : $location
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
                expect($location.path).toHaveBeenCalledWith('/signup');
            });
        });
    });

    describe('transitions', () => {
        it('should specify the classes used for transition', () => {
            expect(p2pPlatformController.pageClass).toBe('signup-login blue');
        });
    });

    describe('submit', () => {
        describe('chose platform is part of the list', () => {
            let platform;

            beforeEach(() => {
                platform = Object.keys(p2pPlatformController.platforms)[0];
                p2pPlatformController.submit(platform);
            });

            it('should store the platform in a cookie', () => {
                expect($cookieStore.put).toHaveBeenCalledWith('signup.platform', platform);
            });

            it('should go to the yearly income page', () => {
                expect($location.path).toHaveBeenCalledWith('/signup/p2pCredentials');
            });
        });

        describe('chose platform is NOT part of the list', () => {
            let platform;

            beforeEach(() => {
                platform = 'hack my platform';
                p2pPlatformController.submit(platform);
            });

            it('should NOT store the platform in a cookie', () => {
                expect($cookieStore.put).not.toHaveBeenCalled();
            });

            it('should NOT go to the yearly income page', () => {
                expect($location.path).not.toHaveBeenCalledWith('/signup/p2pCredentials');
            });
        });
    });
});