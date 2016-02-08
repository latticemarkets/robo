/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 08/02/2016
*/

let portfolioSimulationService;

describe('portfolioSimulationService', () => {
    beforeEach(module('app'));

    beforeEach(inject((_portfolioSimulationService_) => {
        portfolioSimulationService = _portfolioSimulationService_;
    }));

    describe('portfolioKeysValues', () => {
        let result;

        beforeEach(() => {
            result = portfolioSimulationService.portfolioKeysValues;
        });

        it('should be a 5 attributs object', () => {
            expect(Object.keys(result).length).toBe(5);
        });
    });

    describe('simulatedDataFor', () => {
        it('should return an empty array on unknown portfolio name', () => {
            const result = portfolioSimulationService.simulatedDataFor('blabla');
            expect(result.length).toBe(0);
        });

        it('should return 3 arrays of 13 values + title', () => {
            const result = portfolioSimulationService.simulatedDataFor('conservative');
            expect(result.length).toBe(3);
            expect(result[0][0]).toBe('Max');
            expect(result[1][0]).toBe('Simulation');
            expect(result[2][0]).toBe('Min');
            expect(result[0].length).toBe(14);
            expect(result[1].length).toBe(14);
            expect(result[2].length).toBe(14);
        });
    });
});