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

describe('SignupYearlyIncomeController', () => {
    let yearlyIncomeController,
        $cookies,
        $location;

    beforeEach(() => {
        module('app');

        $cookies = jasmine.createSpyObj('$cookies', ['get', 'put']);
        $location = jasmine.createSpyObj('$location', ['path']);
    });

    beforeEach(inject(($controller) => {
        yearlyIncomeController = $controller('SignupYearlyIncomeController', {
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
                expect($cookies.get).toHaveBeenCalledWith('signup.reason');
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
                expect($cookies.get).toHaveBeenCalledWith('signup.reason');
                expect($location.path).toHaveBeenCalledWith('/signup');
            });
        });
    });

    describe('transitions', () => {
        it('should specify the classes used for transition', () => {
            expect(yearlyIncomeController.pageClass).toBe('signup-login blue');
        });
    });

    describe('submit', () => {
        describe('chose income range is part of the list', () => {
            let incomeRange;

            beforeEach(() => {
                incomeRange = Object.keys(yearlyIncomeController.incomeRanges)[0];
                yearlyIncomeController.submit(incomeRange);
            });

            it('should store the income range in a cookie', () => {
                expect($cookies.put).toHaveBeenCalledWith('signup.income', incomeRange);
            });

            it('should go to the timeline page', () => {
                expect($location.path).toHaveBeenCalledWith('/signup/timeline');
            });
        });

        describe('chose income range is NOT part of the list', () => {
            let incomeRange;

            beforeEach(() => {
                incomeRange = 'hack my income range';
                yearlyIncomeController.submit(incomeRange);
            });

            it('should NOT store the income range in a cookie', () => {
                expect($cookies.put).not.toHaveBeenCalled();
            });

            it('should NOT go to the timeline page', () => {
                expect($location.path).not.toHaveBeenCalledWith('/signup/timeline');
            });
        });
    });
});