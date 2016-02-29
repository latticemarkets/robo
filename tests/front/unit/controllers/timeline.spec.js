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

describe('SignupTimelineController', () => {
    let timelineController,
        $cookies,
        $location;

    beforeEach(() => {
        module('app');

        $cookies = jasmine.createSpyObj('$cookies', ['get', 'put']);
        $location = jasmine.createSpyObj('$location', ['path']);
    });

    beforeEach(inject(($controller) => {
        timelineController = $controller('SignupTimelineController', {
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
                expect($cookies.get).toHaveBeenCalledWith('signup.income');
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
                expect($cookies.get).toHaveBeenCalledWith('signup.income');
                expect($location.path).toHaveBeenCalledWith('/signup');
            });
        });
    });

    describe('transitions', () => {
        it('should specify the classes used for transition', () => {
            expect(timelineController.pageClass).toBe('signup-login blue');
        });
    });

    describe('submit', () => {
        describe('chose timeline is part of the list', () => {
            let timeline;

            beforeEach(() => {
                timeline = Object.keys(timelineController.timelines)[0];
                timelineController.submit(timeline);
            });

            it('should store the timeline in a cookie', () => {
                expect($cookies.put).toHaveBeenCalledWith('signup.timeline', timeline);
            });

            it('should go to the birthday page', () => {
                expect($location.path).toHaveBeenCalledWith('/signup/birthday');
            });
        });

        describe('chose timeline is NOT part of the list', () => {
            let timeline;

            beforeEach(() => {
                timeline = 'hack my timeline';
                timelineController.submit(timeline);
            });

            it('should NOT store the timeline in a cookie', () => {
                expect($cookies.put).not.toHaveBeenCalled();
            });

            it('should NOT go to the birthday page', () => {
                expect($location.path).not.toHaveBeenCalledWith('/signup/birthday');
            });
        });
    });
});