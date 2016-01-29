/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 29/01/2016
*/

describe('notificationService', () => {
    let _toastr,
        _notificationService;

    beforeEach(() => {
        module('app');
        module($provide => {
            $provide.service('toastr', () => {
                return {
                    error: jasmine.createSpy('error')
                };
            });
        });
    });

    beforeEach(inject((notificationService, toastr) => {
        _notificationService = notificationService;
        _toastr = toastr;
    }));

    describe('error', () => {
        let message;

        beforeEach(() => {
            message = "myMessage";
            _notificationService.error(message);

        });

        it('should call toastr error', () => {
            expect(_toastr.error).toHaveBeenCalledWith(message, 'Error');
        });
    });
});