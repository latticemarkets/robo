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


    describe('averageMaturity', () => {
        beforeEach(() => {
            _$httpBackend.when('GET', '/api/dashboard/averageMaturity').respond();
            _dashboardDataService.averageMaturity(() => {});
        });

        it('should call averageMaturity API', () => {
            _$httpBackend.expectGET('/api/dashboard/averageMaturity');
            expect(_$httpBackend.flush).not.toThrow();
        });
    });


    describe('averageIntRate', () => {
        beforeEach(() => {
            _$httpBackend.when('GET', '/api/dashboard/averageIntRate').respond();
            _dashboardDataService.averageIntRate(() => {});
        });

        it('should call averageIntRatel API', () => {
            _$httpBackend.expectGET('/api/dashboard/averageIntRate');
            expect(_$httpBackend.flush).not.toThrow();
        });
    });


    describe('expectedReturns', () => {
        beforeEach(() => {
            _$httpBackend.when('GET', '/api/dashboard/expectedReturns').respond();
            _dashboardDataService.expectedReturns(() => {});
        });

        it('should call expectedReturns API', () => {
            _$httpBackend.expectGET('/api/dashboard/expectedReturns');
            expect(_$httpBackend.flush).not.toThrow();
        });
    });


    describe('lastLoanMaturity', () => {
        beforeEach(() => {
            _$httpBackend.when('GET', '/api/dashboard/lastLoanMaturity').respond();
            _dashboardDataService.lastLoanMaturity(() => {});
        });

        it('should call lastLoanMaturity API', () => {
            _$httpBackend.expectGET('/api/dashboard/lastLoanMaturity');
            expect(_$httpBackend.flush).not.toThrow();
        });
    });

    afterEach(() => {
        _$httpBackend.verifyNoOutstandingExpectation();
        _$httpBackend.verifyNoOutstandingRequest();
    });
});