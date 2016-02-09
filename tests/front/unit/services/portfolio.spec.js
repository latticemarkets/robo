/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 08/02/2016
*/

let portfolioService;

describe('portfolioService', () => {
    beforeEach(module('app'));

    beforeEach(() => {
        module($provide => {
            $provide.service('notificationService', () => {
                return {
                    apiError: jasmine.createSpy('apiError')
                };
            });
        });
    });

    let portfolioService, $httpBackend, notificationService;

    beforeEach(inject((_portfolioService_, _$httpBackend_, _notificationService_) => {
        portfolioService = _portfolioService_;
        $httpBackend = _$httpBackend_;
        notificationService = _notificationService_;
    }));

    describe('getPortfolioSuggestion', () => {
        let terms, reason, income, timeline, birthday, callback;

        beforeEach(() => {
            terms = 'aa';
            reason = 'bb';
            income = 'cc';
            timeline = 'dd';
            birthday = 'ee';
            callback = jasmine.createSpy('callback');
            portfolioService.getPortfolioSuggestion(terms, reason, income, timeline, birthday, callback);
        });

        it('should call the api correctly', () => {
            $httpBackend.whenGET('/api/portfolio/suggestion').respond(200);
            $httpBackend.expectGET('/api/portfolio/suggestion');
            expect($httpBackend.flush).not.toThrow();
        });

        it('should call the callback on 200', () => {
            $httpBackend.whenGET('/api/portfolio/suggestion').respond(200);
            expect($httpBackend.flush).not.toThrow();
            expect(callback).toHaveBeenCalled();
        });

        it('should call notification error on error', () => {
            $httpBackend.whenGET('/api/portfolio/suggestion').respond(500);
            expect($httpBackend.flush).not.toThrow();
            expect(notificationService.apiError).toHaveBeenCalled();
        });
    });
});