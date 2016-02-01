/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 01/02/2016
*/

describe('Percent filter', () => {
    'use strict';

    let $filter;

    beforeEach(() => {
        module('app');

        inject(_$filter_ => {
            $filter = _$filter_;
        });
    });

    it('should end with %', function () {
        const intRate = 0.20;

        const result0 = $filter('percent')(intRate, 0);
        const result1 = $filter('percent')(intRate, 1);
        const result2 = $filter('percent')(intRate, 2);

        expect(result0).toEqual('20 %');
        expect(result1).toEqual('20.0 %');
        expect(result2).toEqual('20.00 %');
    });

    it('should give the right number of decimals', function () {
        const intRate = 0.234534;

        const result = $filter('percent')(intRate, 2);

        expect(result).toEqual('23.45 %');
    });

    it('should round', function () {
        const intRateToBeRoundUp = 0.236;
        const intRateToBeRoundUp2 = 0.235;
        const intRateToBeRoundDown = 0.234;

        const resultUp = $filter('percent')(intRateToBeRoundUp, 0);
        const resultUp2 = $filter('percent')(intRateToBeRoundUp2, 0);
        const resultDown = $filter('percent')(intRateToBeRoundDown, 0);

        expect(resultUp).toEqual('24 %');
        expect(resultUp2).toEqual('24 %');
        expect(resultDown).toEqual('23 %');
    });
});