/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 10/02/2016
*/

describe('onResizeService', () => {

    beforeEach(module('app'));

    let onResizeService, $filter;
    beforeEach(inject((_onResizeService_, _$filter_) => {
        onResizeService = _onResizeService_;
        $filter = _$filter_;
    }));

    describe('addOnResizeCallback', () => {

        let callback, callbackId;
        beforeEach(() => {
            callbackId = 'myCallback';
            callback = jasmine.createSpy('callback');
            onResizeService.addOnResizeCallback(callback, callbackId);
        });

        it('should add the callback to callback pool', () => {
            expect(Object.keys(onResizeService.callbackPool).length).toBe(1);
            expect(onResizeService.callbackPool[callbackId]).not.toBeUndefined();
        });
        
        it('should run the callbacks on window resize', () => {
            onResizeService.runCallbacks()();
            expect(callback).toHaveBeenCalled();
        });
    });

    describe('removeOnResizeCallback', () => {
        let callbackId1, callbackId2;
        beforeEach(() => {
            callbackId1 = 'myCallback1';
            callbackId2 = 'myCallback2';
            onResizeService.addOnResizeCallback(() => {}, callbackId1);
            onResizeService.addOnResizeCallback(() => {}, callbackId2);
        });

        it('should remove the callback from the pool', () => {
            expect(Object.keys(onResizeService.callbackPool).length).toBe(2);

            onResizeService.removeOnResizeCallback(callbackId1);

            expect(Object.keys(onResizeService.callbackPool).length).toBe(1);
            expect(onResizeService.callbackPool[callbackId2]).not.toBeUndefined();
            expect(onResizeService.callbackPool[callbackId1]).toBeUndefined();
        });
    });
});