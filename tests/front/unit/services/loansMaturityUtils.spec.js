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

describe('loansMaturityUtilsService', () => {
    let loansMaturityUtilsService;

    beforeEach(() => {
        module('app');
    });

    beforeEach(inject((_loansMaturityUtilsService_) => {
        loansMaturityUtilsService = _loansMaturityUtilsService_
    }));

    describe('extractDataForScatterChart', () => {
        let dataIn, result;

        beforeEach(() => {
            jasmine.clock().mockDate(new Date("2016-08-01"));
        });

        describe('nominal case', () => {
            beforeEach(() => {
                dataIn = [
                    {originator: "originator1", maturityDate: "2016-09-01", intRate: 0.12},
                    {originator: "originator2", maturityDate: "2016-09-15", intRate: 0.12},
                    {originator: "originator1", maturityDate: "2016-10-01", intRate: 0.08},
                    {originator: "originator2", maturityDate: "2016-10-15", intRate: 0.02}
                ];
                result = loansMaturityUtilsService.extractDataForScatterChart(dataIn);
            });

            it('should prepare the data', () => {
                expect(result).toEqual([
                    ["originator1_x", 1, 2],
                    ["originator1", 0.12, 0.08],
                    ["originator2_x", 1.45, 2.45],
                    ["originator2", 0.12, 0.02]
                ]);
            });
        });

        describe('empty input', () => {
            beforeEach(() => {
                dataIn = [];
                result = loansMaturityUtilsService.extractDataForScatterChart(dataIn);
            });

            it('should return an empty array', () => {
                expect(result).toEqual([]);
            });
        });
    });

    describe('extractXs', () => {
        let input, result;

        describe('nominal case', () => {
            beforeEach(() => {
                input = [
                    ["originator1_x", 1, 2],
                    ["originator1", 0.12, 0.08],
                    ["originator2_x", 1.45, 2.45],
                    ["originator2", 0.12, 0.02]
                ];
                result = loansMaturityUtilsService.extractXs(input);
            });

            it('should return originator\'s name with and without adding _x at the end', () => {
                expect(result).toEqual(
                    {
                        originator1: "originator1_x",
                        originator2: "originator2_x"
                    });
            });
        });

        describe('empty input', () => {
            beforeEach(() => {
                input = [];
                result = loansMaturityUtilsService.extractXs(input);
            });

            it('should return an empty object', () => {
                expect(result).toEqual({});
            });
        });
    });

    describe('round2Decimal', () => {
        it('should return a number rounded at 2 decimals', () => {
            expect(loansMaturityUtilsService.round2Decimal(2.383267)).toBe(2.38);
        });

        it('should round to upper number', () => {
            expect(loansMaturityUtilsService.round2Decimal(2.387267)).toBe(2.39);
        });
    });

    describe('endWih', () => {
        it('should work with one letter', () => {
            expect(loansMaturityUtilsService.endsWith('end', 'd')).toBeTruthy();
        });

        it('should work with two letters', () => {
            expect(loansMaturityUtilsService.endsWith('end', 'nd')).toBeTruthy();
        });

        it('should work with the whole word', () => {
            expect(loansMaturityUtilsService.endsWith('end', 'end')).toBeTruthy();
        });
    });
});