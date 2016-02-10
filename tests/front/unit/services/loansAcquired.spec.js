/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 03/02/2016
*/

describe('flotChartService', () => {
    let flotChartService;

    beforeEach(() => {
        module('app');
    });

    beforeEach(inject((_flotChartService_) => {
        flotChartService = _flotChartService_;
    }));

    describe('prepareDataLoansAcquiredPerDay', () => {
        let result;

        beforeEach(() => {
            const input = [3, 4, 6, 1, 7, 90];
            result = flotChartService.prepareDataLoansAcquiredPerDay(input);
        });

        it('should return a well formed object', () => {
            expect(result).toEqual(
                [{
                    label: "line",
                    data: [[1,3], [2,4], [3,6], [4,1], [5,7], [6,90]]
                }]);
        });
    });

    describe('prepareDataRiskDiversification', () => {
        let result;

        beforeEach(() => {
            const input = [{ grade: 'A', value: 20 }, { grade: 'B', value: 30}];
            result = flotChartService.prepareDataRiskDiversification(input);
        });

        it('should return a list of 2 objects', () => {
            expect(result.length).toBe(2);
        });

        it('should return a list of objects containing data, label and color', () => {
            expect(result[0].label).not.toBeUndefined();
            expect(result[0].data).not.toBeUndefined();
            expect(result[0].color).not.toBeUndefined();
        });
    });

    describe('prepareDataPlatformAllocation', () => {
        let result;

        beforeEach(() => {
            const input = [{ originator: 'prosper', loansAcquired: 20 }, { originator: 'B', loansAcquired: 30}];
            result = flotChartService.prepareDataPlatformAllocation(input);
        });

        it('should return a list of 2 objects', () => {
            expect(result.length).toBe(2);
        });

        it('should return a list of objects containing data, label and color', () => {
            expect(result[0].label).not.toBeUndefined();
            expect(result[0].data).not.toBeUndefined();
            expect(result[0].color).not.toBeUndefined();
        });
    });
});