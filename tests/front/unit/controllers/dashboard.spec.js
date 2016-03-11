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
        $scope,
        $cookies,
        $timeout,
        infosCacheService,
        dashboardGuidedTourService;

    beforeEach(() => {
        module('app');

        infosCacheService = jasmine.createSpyObj('infosCacheService', ['getAvailableCapital', 'getAllocatedCapital', 'getAverageIntRate', 'getCurrentRoiRate', 'getExpectedRoiRate', 'getLoansAcquiredPerDayLastWeek']);
        $scope = jasmine.createSpyObj('$scope', ['$on']);
        dashboardGuidedTourService = jasmine.createSpyObj('dashboardGuidedTourService', ['start', 'end', 'init']);
        $cookies = jasmine.createSpyObj('$cookies', ['get', 'remove']);
    });

    let availableCapital;
    beforeEach(() => {
        availableCapital = 1000;
        infosCacheService.getAvailableCapital.and.callFake(callback => callback(availableCapital));
    });

    let allocatedCapital;
    beforeEach(() => {
        allocatedCapital = 2000;
        infosCacheService.getAllocatedCapital.and.callFake(callback => callback(allocatedCapital));
    });

    let averageIntRate;
    beforeEach(() => {
        averageIntRate = 0.12;
        infosCacheService.getAverageIntRate.and.callFake(callback => callback(averageIntRate));
    });

    let currentRoiRate;
    beforeEach(() => {
        currentRoiRate = 0.2;
        infosCacheService.getCurrentRoiRate.and.callFake(callback => callback(currentRoiRate));
    });

    let expectedRoiRate;
    beforeEach(() => {
        expectedRoiRate = 0.3;
        infosCacheService.getExpectedRoiRate.and.callFake(callback => callback(expectedRoiRate));
    });

    let loansAcquiredPerDayLastWeek;
    beforeEach(() => {
        loansAcquiredPerDayLastWeek = 222;
        infosCacheService.getLoansAcquiredPerDayLastWeek.and.callFake(callback => callback(loansAcquiredPerDayLastWeek));
    });

    describe('no guided tour', () => {
        beforeEach(() => {
            $cookies.get.and.returnValue(false);
        });

        beforeEach(inject(($controller, _$timeout_) => {
            dashboardController = $controller('DashboardController', {
                $scope: $scope,
                dashboardGuidedTourService: dashboardGuidedTourService,
                $timeout: _$timeout_,
                $cookies: $cookies,
                infosCacheService: infosCacheService
            });

            $timeout = _$timeout_;
        }));

        describe('data initialisation', () => {
            it('should load available capital from API', () => {
                expect(infosCacheService.getAvailableCapital).toHaveBeenCalled();
                expect(dashboardController.availableCapital).toBe(availableCapital);
            });

            it('should load allocated capital from API', () => {
                expect(infosCacheService.getAllocatedCapital).toHaveBeenCalled();
                expect(dashboardController.allocatedCapital).toBe(allocatedCapital);
            });

            it('should load average interest rate from API', () => {
                expect(infosCacheService.getAverageIntRate).toHaveBeenCalled();
                expect(dashboardController.averageIntRate).toBe(averageIntRate);
            });

            it('should load current roi rate from API', () => {
                expect(infosCacheService.getCurrentRoiRate).toHaveBeenCalled();
                expect(dashboardController.currentRoiRate).toBe(currentRoiRate);
            });

            it('should load expected roi rate from API', () => {
                expect(infosCacheService.getExpectedRoiRate).toHaveBeenCalled();
                expect(dashboardController.expectedRoiRate).toBe(expectedRoiRate);
            });

            it('should load loans acquired per day last week from API', () => {
                expect(infosCacheService.getLoansAcquiredPerDayLastWeek).toHaveBeenCalled();
                expect(dashboardController.loansAcquiredPerDayLastWeek).toBe(loansAcquiredPerDayLastWeek);
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
                infosCacheService: infosCacheService,
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
