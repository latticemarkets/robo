/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 29/04/2016
*/

describe('ForgotPasswordController', () => {
    beforeEach(module('app'));
    
    let $location, userService;
    beforeEach(() => {
        $location = jasmine.createSpyObj('$location', ['path']);
        userService = jasmine.createSpyObj('userService', ['isEmailUsed', 'sendEmail']);
    });
    
    let forgotPasswordController;
    beforeEach(inject($controller => {
        forgotPasswordController = $controller('ForgotPasswordController', {
            $location: $location,
            userService: userService
        });
    }));
    
    describe('email field is empty', () => {
        beforeEach(() => {
            forgotPasswordController.email = '';
        });

        it('should let the submit button disabled', () => {
            expect(forgotPasswordController.disableSubmitButton()).toBeTruthy();
        });
    });

    describe('email field is not well formed', () => {
        beforeEach(() => {
            forgotPasswordController.email = 'julienpdx.technology';
        });

        it('should let the submit button disabled', () => {
            expect(forgotPasswordController.disableSubmitButton()).toBeTruthy();
        });
    });

    describe('email is correct but not used', () => {
        beforeEach(() => {
            forgotPasswordController.email = 'julien@pdx.fr';
            userService.isEmailUsed.and.callFake((email, callback) => callback({ data: { ok: false } }));
            forgotPasswordController.submit();
        });

        it('should enable the submit button', () => {
            expect(forgotPasswordController.disableSubmitButton()).toBeFalsy();
        });

        it('should redirect the user without sending any email', () => {
            expect($location.path).toHaveBeenCalledWith('/signin');
            expect(userService.sendEmail).not.toHaveBeenCalled();
        });
    });

    describe('email is correct and used', () => {
        beforeEach(() => {
            forgotPasswordController.email = 'julien@pdx.fr';
            userService.isEmailUsed.and.callFake((email, callback) => callback({ data: { ok: true } }));
            forgotPasswordController.submit();
        });

        it('should enable the submit button', () => {
            expect(forgotPasswordController.disableSubmitButton()).toBeFalsy();
        });

        it('should send the email', () => {
            expect(userService.sendEmail).toHaveBeenCalled();
        });
    });
});