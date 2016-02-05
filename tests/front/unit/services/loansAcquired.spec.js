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

describe('loansAcquiredService', () => {
    let loansAcquiredService;

    beforeEach(() => {
        module('app');
    });

    beforeEach(inject((_loansAcquiredService_) => {
        loansAcquiredService = _loansAcquiredService_;
    }));

    describe('prepareData', () => {
        let result;

        beforeEach(() => {
            const input = [3, 4, 6, 1, 7, 90];
            result = loansAcquiredService.prepareData(input);
        });

        it('should ', () => {
            expect(result).toEqual(
                [{
                    label: "line",
                    data: [[1,3], [2,4], [3,6], [4,1], [5,7], [6,90]]
                }]);
        });
    });
});