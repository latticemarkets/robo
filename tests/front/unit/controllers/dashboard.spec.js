/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 30/01/2016
*/

describe('DashboardController', () => {
    let dashboardController,
        cssInjector,
        authenticationService,
        $location,
        dashboardDataService,
        userService;

    beforeEach(() => {
        module('app');

        $location = jasmine.createSpyObj('$location', ['path']);
        authenticationService = jasmine.createSpyObj('authenticationService', ['logout', 'getCurrentUsersEmail']);
        cssInjector = jasmine.createSpyObj('cssInjector', ['add']);
        dashboardDataService = jasmine.createSpyObj('dashboardDataService', ['availableCapital', 'allocatedCapital']);
        userService = jasmine.createSpyObj('userService', ['userData']);
    });

    let availableCapital;
    beforeEach(() => {
        availableCapital = 1000;
        dashboardDataService.availableCapital.and.callFake(callback => callback({data: { availableCapital: availableCapital } }));
    });

    let allocatedCapital;
    beforeEach(() => {
        allocatedCapital = 2000;
        dashboardDataService.allocatedCapital.and.callFake(callback => callback({data: { allocatedCapital: allocatedCapital } }));
    });

    let firstName, lastName;
    beforeEach(() => {
        firstName = "Arthur";
        lastName = "Guinness";
        userService.userData.and.callFake((currentUserEmail, callback) => callback({data: { firstName: firstName, lastName: lastName } }));
    });

    beforeEach(inject(($controller) => {
        dashboardController = $controller('DashboardController', {
            $location : $location,
            authenticationService: authenticationService,
            cssInjector: cssInjector,
            dashboardDataService: dashboardDataService,
            userService: userService
        });
    }));

    describe('cssInjection', () => {
        it('should inject Homer css stylesheet on initialization', () => {
            expect(cssInjector.add).toHaveBeenCalledWith('assets/stylesheets/homer_style.css');
        });
    });

    describe('logout', () => {
        beforeEach(() => {
            dashboardController.logout();
        });

        it('should call the authentication service to clear the user\'s credentials', () => {
            expect(authenticationService.logout).toHaveBeenCalled();
        });

        it('should redirect the user to the landpage', () => {
            expect($location.path).toHaveBeenCalledWith('/');
        });
    });

    describe('data initialisation', () => {
        it('should load available capital from API', () => {
            expect(dashboardDataService.availableCapital).toHaveBeenCalled();
            expect(dashboardController.availableCapital).toBe(availableCapital);
        });

        it('should load allocated capital from API', () => {
            expect(dashboardDataService.allocatedCapital).toHaveBeenCalled();
            expect(dashboardController.allocatedCapital).toBe(allocatedCapital);
        });

        it('should set the current date', () => {
            expect(dashboardController.lastUpdate).not.toBeUndefined();
        });

        it('should load user names from API', () => {
            expect(userService.userData).toHaveBeenCalled();
            expect(authenticationService.getCurrentUsersEmail).toHaveBeenCalled();
            expect(dashboardController.username).toBe(`${firstName} ${lastName}`);
        });
    });
});