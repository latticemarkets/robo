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
        $httpBackend;

    beforeEach(inject((_platformService_, _$httpBackend_) => {
        platformService = _platformService_;
        $httpBackend = _$httpBackend_;
    }));

    describe('updatePlatforms', () => {
        let email,
            platforms;

        beforeEach(() => {
            email = 'toto@tata.co.uk';
            platforms = [{name: 'name', apiKey: 'apiKey', accountId: 'accountId'}];

            $httpBackend.when('PUT', '/api/user/p2pPlatforms').respond();

            platformService.updatePlatforms(email, platforms);
        });

        it('should call the API', () => {
            $httpBackend.expectPUT('/api/user/p2pPlatforms', { email: email, platforms: platforms });
            expect($httpBackend.flush).not.toThrow();
        });

        afterEach(() => {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});