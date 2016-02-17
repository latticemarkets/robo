/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 17/02/2016
*/

describe('spinnerService', () => {
    beforeEach(module('app'));

    let spinnerService;
    beforeEach(inject((_spinnerService_) => {
        spinnerService = _spinnerService_;
    }));

    beforeEach(() => {
        spinnerService.callback = jasmine.createSpy('callback');
    });

    describe('on', () => {
        beforeEach(() => {
            spinnerService.on();
        });

        it('should call callback with true', () => {
            expect(spinnerService.callback).toHaveBeenCalledWith(true);
        });
    });

    describe('off', () => {
        beforeEach(() => {
            spinnerService.off();
        });

        it('should call callback with false', () => {
            expect(spinnerService.callback).toHaveBeenCalledWith(false);
        });
    });
});