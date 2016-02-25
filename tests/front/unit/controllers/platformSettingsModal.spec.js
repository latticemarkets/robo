/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 24/02/2016
*/

describe('PlatformSettingsModalController', () => {
    beforeEach(module('app'));

    let $uibModalInstance,
        $timeout,
        platformService,
        platform,
        $scope;

    beforeEach(() => {
        $uibModalInstance = jasmine.createSpyObj('$uibModalInstance', ['close', 'dismiss']);
    });

    beforeEach(() => {
        platformService = jasmine.createSpyObj('platformService', ['updatePlatform']);
    });

    let originator;
    beforeEach(() => {
        originator = 'originator1';

        platform = {
            originator: originator
        };
    });

    beforeEach(() => {
        $scope = {};
    });

    beforeEach(() => {

    });

    let PlatformSettingsModalController;
    beforeEach(inject(($controller, _$timeout_) => {
        PlatformSettingsModalController = $controller('PlatformSettingsModalController', {
            $uibModalInstance: $uibModalInstance,
            $timeout: _$timeout_,
            platformService: platformService,
            platform: platform,
            $scope: $scope
        });

        $timeout = _$timeout_;
    }));

    describe('init', () => {
        it('should init scope.originator', () => {
            expect($scope.originator).toBe(originator);
        });

        describe('in $timeout', () => {
            beforeEach(() => {
                $timeout.flush();
            });

            it('should init scope.platorm', () => {
                expect($scope.platform).toEqual(platform);
            });
        });
    });

    describe('save', () => {
        beforeEach(() => {
            platformService.updatePlatform.and.callFake((platform, callback) => callback());
            $scope.save();
        });

        it('should call platformService.updatePlatform', () => {
            expect(platformService.updatePlatform).toHaveBeenCalled();
        });

        it('should close the modal', () => {
            expect($uibModalInstance.close).toHaveBeenCalledWith('save');
        });
    });

    describe('cancel', () => {
        beforeEach(() => {
            $scope.cancel();
        });

        it('should dismiss the modal', () => {
            expect($uibModalInstance.dismiss).toHaveBeenCalledWith('cancel');
        });
    });
});