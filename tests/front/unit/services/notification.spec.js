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
        _notificationService,
        _$window,
        _$timeout;

    beforeEach(() => {
        module('app');

        module($provide => {
            $provide.service('toastr', () => {
                return {
                    error: jasmine.createSpy('error'),
                    success: jasmine.createSpy('success')
                };
            });
            $provide.service('$window', () => {
                return {
                    location: { href: '' }
                };
            });
        });
    });

    beforeEach(inject((notificationService, toastr, $window, $timeout) => {
        _notificationService = notificationService;
        _toastr = toastr;
        _$window = $window;
        _$timeout = $timeout;
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

    describe('apiError', () => {
        let callback;

        beforeEach(() => {
            callback = _notificationService.apiError();
        });

        let errorMessage;
        describe('status 400', () => {
            errorMessage = "error message";

            beforeEach(() => {
                callback({status: 400, data: errorMessage});
            });

            it('should display notification error containing the message of the response', () => {
                expect(_toastr.error).toHaveBeenCalledWith(errorMessage, 'Bad request');
            });
        });

        describe('status 401', () => {
            beforeEach(() => {
                callback({status: 401});
                _$timeout.flush();
            });

            it('should display a notification error', () => {
                expect(_toastr.error).toHaveBeenCalled();
            });

            it('should redirect the user on the landpage', () => {
                expect(_$window.location.href).toBe('/');
            });
        });

        describe('other error status', () => {
            beforeEach(() => {
                callback({status: 500});
            });

            it('should display a notification error', () => {
                expect(_toastr.error).toHaveBeenCalled();
            });
        });
    });

    describe('success', () => {
        let message, title;

        beforeEach(() => {
            message = 'the message';
            title = 'Success';

            _notificationService.success(message);
        });

        it('should display a success notification', () => {
            expect(_toastr.success).toHaveBeenCalledWith(message, title);
        });
    });
});