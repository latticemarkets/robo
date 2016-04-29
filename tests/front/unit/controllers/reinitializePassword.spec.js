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

describe('ReinitializePasswordController', () => {
    beforeEach(module('app'));

    let userService, $routeParams;
    beforeEach(() => {
        userService = jasmine.createSpyObj('userService', ['reinitializePassword']);
        $routeParams = { token: '?foo' };
    });

    let reinitializePasswordController;
    beforeEach(inject(($controller, patternCheckerService) => {
        reinitializePasswordController = $controller('ReinitializePasswordController', {
            $routeParams: $routeParams,
            patternCheckerService: patternCheckerService,
            userService: userService
        });
    }));

    describe('both password field are empty', () => {
        beforeEach(() => {
            reinitializePasswordController.newPassword = '';
            reinitializePasswordController.confirmPassword = '';
        });

        it('should keep the submit button disabled', () => {
            expect(reinitializePasswordController.disableSubmitButton()).toBeTruthy();
        });
    });
    
    describe('the first field is empty and the second is not', () => {
        beforeEach(() => {
            reinitializePasswordController.newPassword = '';
            reinitializePasswordController.confirmPassword = 'MLFKS+ç6D';
        });

        it('should keep the submit button disabled', () => {
            expect(reinitializePasswordController.disableSubmitButton()).toBeTruthy();
        });
    });

    describe('the first field is not empty and the second is', () => {
        beforeEach(() => {
            reinitializePasswordController.newPassword = 'MLFKS+ç6D';
            reinitializePasswordController.confirmPassword = 'MLFKS+ç6D';
        });

        it('should keep the submit button disabled', () => {
            expect(reinitializePasswordController.disableSubmitButton()).toBeTruthy();
        });
    });

    describe('the two fields are filled but not complex enough', () => {
        beforeEach(() => {
            reinitializePasswordController.newPassword = 'foo';
            reinitializePasswordController.confirmPassword = 'foo';
        });

        it('should keep the submit button disabled', () => {
            expect(reinitializePasswordController.disableSubmitButton()).toBeTruthy();
        });
    });

    describe('the two fields are filled and complex enough but do no match', () => {
        beforeEach(() => {
            reinitializePasswordController.newPassword = '976DFHv++=';
            reinitializePasswordController.confirmPassword = 'PZE87RV==';
        });

        it('should keep the submit button disabled', () => {
            expect(reinitializePasswordController.disableSubmitButton()).toBeTruthy();
        });
    });

    describe('the two fields are filled, complex enough and match', () => {
        beforeEach(() => {
            reinitializePasswordController.newPassword = '976DFHv++=';
            reinitializePasswordController.confirmPassword = '976DFHv++=';
        });

        it('should enable the submit button', () => {
            expect(reinitializePasswordController.disableSubmitButton()).toBeFalsy();
        });
    });

    describe('hit shubmit button when : both password field are empty', () => {
        beforeEach(() => {
            reinitializePasswordController.newPassword = '';
            reinitializePasswordController.confirmPassword = '';
            reinitializePasswordController.submit();
        });

        it('should not call the service', () => {
            expect(userService.reinitializePassword).not.toHaveBeenCalled();
        });
    });

    describe('hit shubmit button when : the first field is empty and the second is not', () => {
        beforeEach(() => {
            reinitializePasswordController.newPassword = '';
            reinitializePasswordController.confirmPassword = 'MLFKS+ç6D';
            reinitializePasswordController.submit();
        });

        it('should not call the service', () => {
            expect(userService.reinitializePassword).not.toHaveBeenCalled();
        });
    });

    describe('hit shubmit button when : the first field is not empty and the second is', () => {
        beforeEach(() => {
            reinitializePasswordController.newPassword = 'MLFKS+ç6D';
            reinitializePasswordController.confirmPassword = 'MLFKS+ç6D';
            reinitializePasswordController.submit();
        });

        it('should not call the service', () => {
            expect(userService.reinitializePassword).not.toHaveBeenCalled();
        });
    });

    describe('hit shubmit button when : the two fields are filled but not complex enough', () => {
        beforeEach(() => {
            reinitializePasswordController.newPassword = 'foo';
            reinitializePasswordController.confirmPassword = 'foo';
            reinitializePasswordController.submit();
        });

        it('should not call the service', () => {
            expect(userService.reinitializePassword).not.toHaveBeenCalled();
        });
    });

    describe('hit shubmit button when : the two fields are filled and complex enough but do no match', () => {
        beforeEach(() => {
            reinitializePasswordController.newPassword = '976DFHv++=';
            reinitializePasswordController.confirmPassword = 'PZE87RV==';
            reinitializePasswordController.submit();
        });

        it('should not call the service', () => {
            expect(userService.reinitializePassword).not.toHaveBeenCalled();
        });
    });

    describe('hit shubmit button when : the two fields are filled, complex enough and match', () => {
        let password;
        beforeEach(() => {
            password = '976DFHv++=';
            reinitializePasswordController.newPassword = password;
            reinitializePasswordController.confirmPassword = password;
            reinitializePasswordController.submit();
        });

        it('should not call the service', () => {
            expect(userService.reinitializePassword).toHaveBeenCalledWith('foo', password);
        });
    });
});