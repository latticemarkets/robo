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

describe('SignupTermAndCoController', () => {
    let termAndCoController,
        $cookies,
        $location;

    beforeEach(() => {
        module('app');

        $cookies = jasmine.createSpyObj('$cookies', ['get', 'put']);
        $location = jasmine.createSpyObj('$location', ['path']);
    });

    beforeEach(inject(($controller) => {
        termAndCoController = $controller('SignupTermAndCoController', {
            $cookies : $cookies,
            $location : $location
        });
    }));

    describe('initialization', () => {
        describe('data are present', () => {
            beforeEach(() => {
                $cookies.get.and.callFake(() => jasmine.any(String));
            });

            it('should get previous data', () => {
                expect($cookies.get).toHaveBeenCalledWith('signup.email');
                expect($cookies.get).toHaveBeenCalledWith('signup.password');
            });
        });

        describe('data are NOT present', () => {
            beforeEach(() => {
                $cookies.get.and.callFake(() => undefined);
            });

            it('go back to first registration page', () => {
                expect($cookies.get).toHaveBeenCalledWith('signup.email');
                expect($cookies.get).toHaveBeenCalledWith('signup.password');
                expect($location.path).toHaveBeenCalledWith('/signup');
            });
        });
    });

    describe('transitions', () => {
        it('should specify the classes used for transition', () => {
            expect(termAndCoController.pageClass).toBe('signup-login blue');
        });
    });

    describe('submit', () => {
        beforeEach(() => {
            termAndCoController.submit();
        });

        it('should store a true value in a cookie', () => {
            expect($cookies.put).toHaveBeenCalledWith('signup.terms', 'true');
        });

        it('should go to the reason of investment page', () => {
            expect($location.path).toHaveBeenCalledWith('/signup/reasonInvestment');
        });
    });

    describe('cancel', () => {
        beforeEach(() => {
            termAndCoController.cancel();
        });

        it('should go back to first registration page', () => {
            expect($location.path).toHaveBeenCalledWith('/signup');
        });
    });
});