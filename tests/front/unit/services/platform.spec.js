/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 23/02/2016
*/

describe('platformService', () => {
    beforeEach(module('app'));

    let platformService,
        $httpBackend,
        infosCacheService;

    beforeEach(() => {
        module($provide => {
            $provide.service('infosCacheService', () => {
                return {
                    getNumberOfPlatforms: jasmine.createSpy('getNumberOfPlatforms'),
                    setNumberOfPlatforms: jasmine.createSpy('setNumberOfPlatforms')
                };
            });
        });
    });

    beforeEach(inject((_platformService_, _$httpBackend_, _infosCacheService_) => {
        platformService = _platformService_;
        $httpBackend = _$httpBackend_;
        infosCacheService = _infosCacheService_;
    }));

    describe('updatePlatforms', () => {
        let platforms;

        beforeEach(() => {
            platforms = [{name: 'name', apiKey: 'apiKey', accountId: 'accountId'}];

            $httpBackend.when('PUT', '/api/user/p2pPlatforms').respond();

            platformService.updatePlatforms(platforms);
        });

        it('should call the API', () => {
            $httpBackend.expectPUT('/api/user/p2pPlatforms', { platforms: platforms });
            expect($httpBackend.flush).not.toThrow();

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should update cached number of platforms', () => {
            expect(infosCacheService.setNumberOfPlatforms).toHaveBeenCalledWith(platforms.length);
        });
    });

    describe('getPlatforms', () => {
        beforeEach(() => {
            $httpBackend.when('GET', '/api/user/platforms').respond();

            platformService.getPlatforms();
        });

        it('should call the API', () => {
            $httpBackend.expectGET('/api/user/platforms');
            expect($httpBackend.flush).not.toThrow();
        });

        afterEach(() => {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('addPlatform', () => {
        let originator,
            accountId,
            apiKey;

        beforeEach(() => {
            originator = 'originator1';
            accountId = 'accountId1';
            apiKey = 'apiKey1';

            infosCacheService.getNumberOfPlatforms.and.callFake(callback => callback(0));

            $httpBackend.when('POST', '/api/user/platform').respond();

            platformService.addPlatform(originator, accountId, apiKey);
        });

        it('should call the API', () => {
            $httpBackend.expectPOST('/api/user/platform', { platform: { originator: originator, accountId: accountId, apiKey: apiKey } });
            expect($httpBackend.flush).not.toThrow();

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should update the cache number of platforms', () => {
            expect(infosCacheService.getNumberOfPlatforms).toHaveBeenCalled();
            expect(infosCacheService.setNumberOfPlatforms).toHaveBeenCalledWith(1);
        });
    });

    describe('updatePlatform', () => {
        let platform;

        beforeEach(() => {
            platform = {};

            $httpBackend.when('PUT', '/api/user/platform').respond();

            platformService.updatePlatform(platform);
        });

        it('should call the API', () => {
            $httpBackend.expectPUT('/api/user/platform', { platform: {} });
            expect($httpBackend.flush).not.toThrow();

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});