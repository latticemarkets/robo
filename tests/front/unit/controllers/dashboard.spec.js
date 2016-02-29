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
        authenticationService,
        $location,
        dashboardDataService,
        userService,
        loansAcquiredService,
        $scope,
        $cookies,
        $timeout,
        dashboardGuidedTourService;

    beforeEach(() => {
        module('app');

        $location = jasmine.createSpyObj('$location', ['path']);
        authenticationService = jasmine.createSpyObj('authenticationService', ['logout', 'getCurrentUsersEmail']);
        dashboardDataService = jasmine.createSpyObj('dashboardDataService', ['availableCapital', 'allocatedCapital', 'averageIntRate', 'expectedReturns', 'lastLoanMaturity', 'currentRoiRate', 'expectedRoiRate', 'currentLoansPromise', 'loansAcquiredPerDayLastWeek', 'loansAcquiredLastWeek', 'loansAcquiredToday', 'platformAllocationPromise', 'riskDiversificationPromise']);
        userService = jasmine.createSpyObj('userService', ['userData']);
        loansAcquiredService = jasmine.createSpyObj('loansAcquiredService', ['prepare', 'barChartOptions']);
        $scope = jasmine.createSpyObj('$scope', ['$on']);
        dashboardGuidedTourService = jasmine.createSpyObj('dashboardGuidedTourService', ['start', 'end', 'init']);
        $cookies = jasmine.createSpyObj('$cookies', ['get', 'remove']);
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

    let averageIntRate;
    beforeEach(() => {
        averageIntRate = 0.12;
        dashboardDataService.averageIntRate.and.callFake(callback => callback({data: { averageIntRate: averageIntRate } }));
    });

    let expectedReturns;
    beforeEach(() => {
        expectedReturns = 200000;
        dashboardDataService.expectedReturns.and.callFake(callback => callback({data: { expectedReturns: expectedReturns } }));
    });

    let lastLoanMaturity;
    beforeEach(() => {
        jasmine.clock().mockDate(new Date("2016-08-01"));
        lastLoanMaturity = "2016-12-01";
        dashboardDataService.lastLoanMaturity.and.callFake(callback => callback({data: { lastLoanMaturity: lastLoanMaturity } }));
    });

    let currentRoiRate;
    beforeEach(() => {
        currentRoiRate = 0.2;
        dashboardDataService.currentRoiRate.and.callFake(callback => callback({data: { currentRoiRate: currentRoiRate } }));
    });

    let expectedRoiRate;
    beforeEach(() => {
        expectedRoiRate = 0.3;
        dashboardDataService.expectedRoiRate.and.callFake(callback => callback({data: { expectedRoiRate: expectedRoiRate } }));
    });

    let firstName, lastName;
    beforeEach(() => {
        firstName = "Arthur";
        lastName = "Guinness";
        userService.userData.and.callFake((currentUserEmail, callback) => callback({data: { firstName: firstName, lastName: lastName } }));
    });


    describe('no guided tour', () => {
        beforeEach(() => {
            $cookies.get.and.returnValue(false);
        });

        beforeEach(inject(($controller, _$timeout_) => {
            dashboardController = $controller('DashboardController', {
                $location : $location,
                authenticationService: authenticationService,
                dashboardDataService: dashboardDataService,
                userService: userService,
                loansAcquiredService: loansAcquiredService,
                $scope: $scope,
                dashboardGuidedTourService: dashboardGuidedTourService,
                $timeout: _$timeout_,
                $cookies: $cookies
            });

            $timeout = _$timeout_;
        }));

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

            it('should load average interest rate from API', () => {
                expect(dashboardDataService.averageIntRate).toHaveBeenCalled();
                expect(dashboardController.averageIntRate).toBe(averageIntRate);
            });

            it('should load current roi rate from API', () => {
                expect(dashboardDataService.currentRoiRate).toHaveBeenCalled();
                expect(dashboardController.currentRoiRate).toBe(currentRoiRate);
            });

            it('should load expected roi rate from API', () => {
                expect(dashboardDataService.expectedRoiRate).toHaveBeenCalled();
                expect(dashboardController.expectedRoiRate).toBe(expectedRoiRate);
            });

            it('should get a promise containing the current loans', () => {
                expect(dashboardDataService.currentLoansPromise).toHaveBeenCalled();
            });

            it('should get a promise containing the portfolio allocation', () => {
                expect(dashboardDataService.platformAllocationPromise).toHaveBeenCalled();
            });

            it('should get a promise containing the risk diversification', () => {
                expect(dashboardDataService.riskDiversificationPromise).toHaveBeenCalled();
            });
        });

        describe('no guided tour', () => {
            it('should not start the guided tour', () => {
                expect(dashboardGuidedTourService.start).not.toHaveBeenCalled();
            });

            it('should not remove the cookie', () => {
                expect($cookies.remove).not.toHaveBeenCalledWith('guidedTour');
            });

            it('should not set on destroy', () => {
                expect($scope.$on).not.toHaveBeenCalled();
            });
        });
    });

    describe('with guided tour', () => {
        beforeEach(() => {
            $cookies.get.and.returnValue(true);
            $scope.$on.and.callFake((str, callback) => {
                callback();

                it('should set on destroy', () => {
                    expect(str).toBe('$destroy');
                });

                it('should end the tour', () => {
                    expect(dashboardGuidedTourService.end).toHaveBeenCalled();
                });
            })
        });

        beforeEach(inject(($controller, _$timeout_) => {
            dashboardController = $controller('DashboardController', {
                $location : $location,
                authenticationService: authenticationService,
                dashboardDataService: dashboardDataService,
                userService: userService,
                loansAcquiredService: loansAcquiredService,
                $scope: $scope,
                dashboardGuidedTourService: dashboardGuidedTourService,
                $timeout: _$timeout_,
                $cookies: $cookies
            });

            $timeout = _$timeout_;
        }));

        describe('guided tour', () => {
            beforeEach(() => {
                $timeout.flush();
            })
            ;
            it('should look at the guidedTour cookie', () => {
                expect($cookies.get).toHaveBeenCalledWith('guidedTour');
            });

            it('should init the guided tour', () => {
                expect(dashboardGuidedTourService.init).toHaveBeenCalled();
            });

            it('should start the guided tour', () => {
                expect(dashboardGuidedTourService.start).toHaveBeenCalled();
            });

            it('should remove the cookie', () => {
                expect($cookies.remove).toHaveBeenCalledWith('guidedTour');
            });
        });
    });
});
