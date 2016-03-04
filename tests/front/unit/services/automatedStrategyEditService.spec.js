/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 26/02/2016
*/

describe('automatedStrategyEditService', () => {
    beforeEach(module('app'));

    beforeEach(() => {
        module($provide => {
            $provide.service('notificationService', () => ({
                apiError: jasmine.createSpy('apiError')
            }));
            $provide.service('$location', () => ({
                path: jasmine.createSpy('path')
            }));
            $provide.service('constantsService', () => ({
                platforms: jasmine.createSpy('platforms')
            }));
        });
    });

    let automatedStrategyEditService,
        $httpBackend,
        $location,
        $routeParams,
        constantsService;

    beforeEach(inject((_automatedStrategyEditService_, _$httpBackend_, _$location_, _constantsService_, _$routeParams_) => {
        automatedStrategyEditService = _automatedStrategyEditService_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        constantsService = _constantsService_;
        $routeParams = _$routeParams_;
    }));

    describe('getStrategySimulations', () => {
        let originator;

        beforeEach(() => {
            originator = 'aaa';
            $httpBackend.when('GET', `/api/strategies/auto/simulation/${originator}`).respond();

            automatedStrategyEditService.getStrategySimulations(originator, () => {});
        });

        it('should call the API', () => {
            $httpBackend.expectGET(`/api/strategies/auto/simulation/${originator}`);
            expect($httpBackend.flush).not.toThrow();
        });

        afterEach(() => {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('getPlatformFromUrl', () => {
        let result;

        describe('platforms list match url platform', () => {
            beforeEach(() => {
                $routeParams.platform = 'thePlatform';
                constantsService.platforms.and.returnValue(['thePlatform']);
                result = automatedStrategyEditService.getPlatformFromUrl();
            });

            it('should not go back to platforms page', () => {
                expect($location.path).not.toHaveBeenCalledWith('/platforms');
            });

            it('should return url platform', () => {
                expect(result).toBe('thePlatform');
            });
        });

        describe('platforms list does not match url platform', () => {
            beforeEach(() => {
                $routeParams.platform = 'thePlatform';
                constantsService.platforms.and.returnValue([]);
                result = automatedStrategyEditService.getPlatformFromUrl();
            });

            it('should go back to platforms page', () => {
                expect($location.path).toHaveBeenCalledWith('/platforms');
            });

            it('should return undefined', () => {
                expect(result).toBeUndefined();
            });
        });
    });
});