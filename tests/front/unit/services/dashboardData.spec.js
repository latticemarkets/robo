/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 01/02/2016
*/

describe('dashboardDataService', () => {
    let _$httpBackend,
        _dashboardDataService,
        errorCallback;

    beforeEach(() => {
        module('app');
    });

    beforeEach(() => {
        errorCallback = jasmine.createSpy('errorCallback');
        module($provide => {
            $provide.service('notificationService', () => {
                return {
                    apiError: () => errorCallback
                };
            });
        });
    });

    beforeEach(inject((dashboardDataService, $httpBackend) => {
        _dashboardDataService = dashboardDataService;
        _$httpBackend = $httpBackend;
    }));

    describe('portfolioMetrics', () => {
        describe('responds 200', () => {
            beforeEach(() => {
                _$httpBackend.when('GET', '/api/dashboard/portfolioMetrics').respond();
                _dashboardDataService.portfolioMetrics(() => {});
            });

            it('should call portfolioMetrics API', () => {
                _$httpBackend.expectGET('/api/dashboard/portfolioMetrics');
                expect(_$httpBackend.flush).not.toThrow();
            });
        });

        describe('responds an error', () => {
            beforeEach(() => {
                _$httpBackend.when('GET', '/api/dashboard/portfolioMetrics').respond(400);
                _dashboardDataService.portfolioMetrics(() => {});
            });

            it('should call portfolioMetrics API', () => {
                _$httpBackend.expectGET('/api/dashboard/portfolioMetrics');
                expect(_$httpBackend.flush).not.toThrow();
                expect(errorCallback).toHaveBeenCalled();
            });
        });
    });

    afterEach(() => {
        _$httpBackend.verifyNoOutstandingExpectation();
        _$httpBackend.verifyNoOutstandingRequest();
    });
});
