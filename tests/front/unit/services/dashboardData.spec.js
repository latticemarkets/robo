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
        _dashboardDataService;

    beforeEach(() => {
        module('app');
    });

    beforeEach(inject((dashboardDataService, $httpBackend) => {
        _dashboardDataService = dashboardDataService;
        _$httpBackend = $httpBackend;
    }));

    describe('availableCapital', () => {
        beforeEach(() => {
            _$httpBackend.when('GET', '/api/dashboard/capital/available').respond();
            _dashboardDataService.availableCapital(() => {});
        });

        it('should call availableCapital API', () => {
            _$httpBackend.expectGET('/api/dashboard/capital/available');
            expect(_$httpBackend.flush).not.toThrow();
        });
    });

    describe('allocatedCapital', () => {
        beforeEach(() => {
            _$httpBackend.when('GET', '/api/dashboard/capital/allocated').respond();
            _dashboardDataService.allocatedCapital(() => {});
        });

        it('should call allocatedCapital API', () => {
            _$httpBackend.expectGET('/api/dashboard/capital/allocated');
            expect(_$httpBackend.flush).not.toThrow();
        });
    });

    afterEach(() => {
        _$httpBackend.verifyNoOutstandingExpectation();
        _$httpBackend.verifyNoOutstandingRequest();
    });
});