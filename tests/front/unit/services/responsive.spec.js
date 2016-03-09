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

describe('responsiveService', () => {

    beforeEach(module('app'));

    let responsiveService, $filter;
    beforeEach(inject((_responsiveService_, _$filter_) => {
        responsiveService = _responsiveService_;
        $filter = _$filter_;
    }));

    describe('addOnResizeCallback', () => {
        let callback, callbackId;

        beforeEach(() => {
            callbackId = 'myCallback';
            callback = jasmine.createSpy('callback');
            responsiveService.addOnResizeCallback(callback, callbackId);
        });

        it('should add the callback to callback pool', () => {
            expect(Object.keys(responsiveService.callbackPool).length).toBe(1);
            expect(responsiveService.callbackPool[callbackId]).not.toBeUndefined();
        });
    });

    describe('removeOnResizeCallback', () => {
        let callbackId1, callbackId2;

        beforeEach(() => {
            callbackId1 = 'myCallback1';
            callbackId2 = 'myCallback2';
            responsiveService.addOnResizeCallback(() => {}, callbackId1);
            responsiveService.addOnResizeCallback(() => {}, callbackId2);
        });

        it('should remove the callback from the pool', () => {
            expect(Object.keys(responsiveService.callbackPool).length).toBe(2);

            responsiveService.removeOnResizeCallback(callbackId1);

            expect(Object.keys(responsiveService.callbackPool).length).toBe(1);
            expect(responsiveService.callbackPool[callbackId2]).not.toBeUndefined();
            expect(responsiveService.callbackPool[callbackId1]).toBeUndefined();
        });
    });

    describe('runCallbacks', () => {
        let callback1,
            callback2;

        beforeEach(() => {
            callback1 = jasmine.createSpy('callback1');
            callback2 = jasmine.createSpy('callback2');
            responsiveService.addOnResizeCallback(callback1, 'callback1');
            responsiveService.addOnResizeCallback(callback2, 'callback2');

            const container = {
                width: jasmine.createSpy('width')
            };
            const width = 100;
            container.width.and.returnValue(width);
            responsiveService.currentWrapperWidth = 99;

            responsiveService.runCallbacks(container)();
        });

        it('should call all callbacks', () => {
            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });
    });
});