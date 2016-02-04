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

describe('allocationPerPlatformService', () => {
    let allocationPerPlatformService, $filter;

    beforeEach(module('app'));

    beforeEach(inject((_allocationPerPlatformService_, _$filter_) => {
        allocationPerPlatformService = _allocationPerPlatformService_;
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
                result = allocationPerPlatformService.prepareData(input);
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
        });
    });
});