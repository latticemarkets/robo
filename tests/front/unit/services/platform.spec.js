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
        authenticationService;

    beforeEach(() => {
        module($provide => {
            $provide.service('authenticationService', () => {
                return {
                    getCurrentUsersEmail: jasmine.createSpy('getCurrentUsersEmail')
                };
            });
        });
    });

    beforeEach(inject((_platformService_, _$httpBackend_, _authenticationService_) => {
        platformService = _platformService_;
        $httpBackend = _$httpBackend_;
        authenticationService = _authenticationService_;
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
        });

        afterEach(() => {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
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
        let email,
            originator,
            accountId,
            apiKey;

        beforeEach(() => {
            email = 'toto@tata.co.uk';
            originator = 'originator1';
            accountId = 'accountId1';
            apiKey = 'apiKey1';

            $httpBackend.when('POST', '/api/user/platform').respond();

            platformService.addPlatform(email, originator, accountId, apiKey);
        });

        it('should call the API', () => {
            $httpBackend.expectPOST('/api/user/platform', { email: email, platform: { originator: originator, accountId: accountId, apiKey: apiKey } });
            expect($httpBackend.flush).not.toThrow();
        });

        afterEach(() => {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('updatePlatform', () => {
        let platform,
            email;

        beforeEach(() => {
            email = 'toto@tata.co.uk';
            platform = {};

            $httpBackend.when('PUT', '/api/user/platform').respond();
            authenticationService.getCurrentUsersEmail.and.returnValue(email);

            platformService.updatePlatform(platform);
        });

        it('should get user\'s email', () => {
            expect(authenticationService.getCurrentUsersEmail).toHaveBeenCalled();
        });

        it('should call the API', () => {
            $httpBackend.expectPUT('/api/user/platform', { email: email, platform: {} });
            expect($httpBackend.flush).not.toThrow();

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});