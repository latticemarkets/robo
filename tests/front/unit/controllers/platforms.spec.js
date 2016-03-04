/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 11/02/2016
*/

describe('PlatformsController', () => {
    let platformsController,
        $scope,
        platformService,
        spinnerService;

    beforeEach(module('app'));

    let watcher;
    beforeEach(() => {
        $scope = jasmine.createSpyObj('$scope', ['$watch']);
        $scope.$watch.and.callFake((objToWatch, callback) => watcher = callback);
    });

    beforeEach(() => {
        platformService = jasmine.createSpyObj('platformService', ['getPlatforms', 'updatePlatforms']);
        platformService.getPlatforms.and.callFake(callback => callback({ data: [{ mode: 'automated' }] }));
    });

    beforeEach(() => {
        spinnerService = jasmine.createSpyObj('spinnerService', ['on', 'off']);
    });

    beforeEach(inject(($controller) => {
        platformsController = $controller('PlatformsController', {
            $scope: $scope,
            spinnerService: spinnerService,
            platformService: platformService
        });
    }));

    describe('totalExpect', () => {
        it('should return the sum of all expected returns', () => {
            const input = { primary: {buyStrategies: [{expectedReturn: { value: 1200 } }, {expectedReturn: { value: 4800 } }]}};
            const result = platformsController.totalExpected(input);
            expect(result).toBe(6000);
        });

        it('should return 0 if there is no rule', () => {
            const result = platformsController.totalExpected({ primary: {buyStrategies: []}});
            expect(result).toBe(0);
        });
    });

    describe('data initialisation', () => {
        it('should get the platforms', () => {
            expect(platformService.getPlatforms).toHaveBeenCalled();
        });

        it('should add isAuto to each platform', () => {
            expect(platformsController.platforms[0].isAuto).not.toBeUndefined();
        });

        it('should call the $watch', () => {
            expect($scope.$watch).toHaveBeenCalled();
        });
    });

    describe('watch', () => {

        let tmpPlatforms,
            updatePlatformCallback;
        beforeEach(() => {
            platformService.updatePlatforms.and.callFake((_tmpPlatforms_, callback) => {
                tmpPlatforms = _tmpPlatforms_;
                updatePlatformCallback = callback;
            });
            watcher();
        });

        it('should set up the spinner', () => {
            expect(spinnerService.on).toHaveBeenCalled();
        });

        it('should change mode to the good value', () => {
            expect(platformsController.platforms[0].mode).toBe('automated');
        });

        it('should remove isAuto from the platform object', () => {
            expect(tmpPlatforms[0].isAuto).toBeUndefined();
        });

        describe('updatePlatforms callback', () => {
            beforeEach(() => {
                updatePlatformCallback();
            });

            it('should set the spinner to off', () => {
                expect(spinnerService.off).toHaveBeenCalled();
            });
        });
    });
});