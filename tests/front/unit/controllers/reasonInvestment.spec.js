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

describe('SignupReasonInvestmentController', () => {
    let reasonInvestmentController,
        $cookies,
        $location;

    beforeEach(() => {
        module('app');

        $cookies = jasmine.createSpyObj('$cookies', ['get', 'put']);
        $location = jasmine.createSpyObj('$location', ['path']);
    });

    beforeEach(inject(($controller) => {
        reasonInvestmentController = $controller('SignupReasonInvestmentController', {
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
                expect($cookies.get).toHaveBeenCalledWith('signup.terms');
            });
        });

        describe('data are NOT present', () => {
            beforeEach(() => {
                $cookies.get.and.callFake(() => undefined);
            });

            it('go back to first registration page', () => {
                expect($cookies.get).toHaveBeenCalledWith('signup.email');
                expect($cookies.get).toHaveBeenCalledWith('signup.password');
                expect($cookies.get).toHaveBeenCalledWith('signup.terms');
                expect($location.path).toHaveBeenCalledWith('/signup');
            });
        });
    });

    describe('transitions', () => {
        it('should specify the classes used for transition', () => {
            expect(reasonInvestmentController.pageClass).toBe('signup-login blue');
        });
    });

    describe('submit', () => {
        describe('chose reason is part of the list', () => {
            let reason;

            beforeEach(() => {
                reason = Object.keys(reasonInvestmentController.reasons)[0];
                reasonInvestmentController.submit(reason);
            });

            it('should store the reason in a cookie', () => {
                expect($cookies.put).toHaveBeenCalledWith('signup.reason', reason);
            });

            it('should go to the yearly income page', () => {
                expect($location.path).toHaveBeenCalledWith('/signup/yearlyIncome');
            });
        });

        describe('chose reason is NOT part of the list', () => {
            let reason;

            beforeEach(() => {
                reason = 'hack my reason';
                reasonInvestmentController.submit(reason);
            });

            it('should NOT store the reason in a cookie', () => {
                expect($cookies.put).not.toHaveBeenCalled();
            });

            it('should NOT go to the yearly income page', () => {
                expect($location.path).not.toHaveBeenCalledWith('/signup/yearlyIncome');
            });
        });
    });
});