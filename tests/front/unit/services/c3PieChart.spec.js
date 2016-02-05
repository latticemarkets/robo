/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 04/02/2016
*/

describe('c3PieChartService', () => {
    let c3PieChartService, $filter;

    beforeEach(module('app'));

    beforeEach(inject((_c3PieChartService_, _$filter_) => {
        c3PieChartService = _c3PieChartService_;
        $filter = _$filter_;
    }));

    describe('prepareData', () => {
        describe('nominal case', () => {
            let result;

            beforeEach(() => {
                const input = [
                    {originator: "firstOriginator", loansAcquired: 2},
                    {originator: "secondOriginator", loansAcquired: 5}
                ];
                result = c3PieChartService.prepareData(input, 'originator', 'loansAcquired');
            });

            it('should be an array of couples', () => {
                expect(result.length).toBe(2);
                expect(result[0].length).toBe(2);
                expect(result[1].length).toBe(2);
            });

            it('should change originators into uncamelCased titles', () => {
                expect(result[0][0]).toBe("First Originator");
                expect(result[1][0]).toBe("Second Originator");
            });

            it('should keep the values unchanged', () => {
                expect(result[0][1]).toBe(2);
                expect(result[1][1]).toBe(5);
            });
        });
    });

    describe('preparePlatformAllocationData', () => {
        describe('nominal case', () => {
            let result;

            beforeEach(() => {
                const input = [
                    {originator: "firstOriginator", loansAcquired: 2},
                    {originator: "secondOriginator", loansAcquired: 5}
                ];
                result = c3PieChartService.preparePlatformAllocationData(input);
            });

            it('should be an array of couples', () => {
                expect(result.length).toBe(2);
                expect(result[0].length).toBe(2);
                expect(result[1].length).toBe(2);
            });

            it('should change originators into uncamelCased titles', () => {
                expect(result[0][0]).toBe("First Originator");
                expect(result[1][0]).toBe("Second Originator");
            });

            it('should keep the values unchanged', () => {
                expect(result[0][1]).toBe(2);
                expect(result[1][1]).toBe(5);
            });
        });
    });

    describe('prepareRiskDiversificationData', () => {
        describe('nominal case', () => {
            let result;

            beforeEach(() => {
                const input = [
                    {grade: "a", value: 2},
                    {grade: "b", value: 5}
                ];
                result = c3PieChartService.prepareRiskDiversificationData(input);
            });

            it('should be an array of couples', () => {
                expect(result.length).toBe(2);
                expect(result[0].length).toBe(2);
                expect(result[1].length).toBe(2);
            });

            it('should change grades into upperCase titles', () => {
                expect(result[0][0]).toBe("A");
                expect(result[1][0]).toBe("B");
            });

            it('should keep the values unchanged', () => {
                expect(result[0][1]).toBe(2);
                expect(result[1][1]).toBe(5);
            });
        });
    });
});