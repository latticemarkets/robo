/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 19/02/2016
*/

describe('dashboardGuidedTourService', () => {
    beforeEach(module('app'));

    let dashboardGuidedTourService;

    beforeEach(inject((_dashboardGuidedTourService_) => {
        dashboardGuidedTourService = _dashboardGuidedTourService_;
    }));
    describe('tour initialization', () => {
        it('should instantiate the Tour object', () => {
            expect(dashboardGuidedTourService.tour).not.toBeUndefined();
        });
    });

    describe('init', () => {
        beforeEach(() => {
            spyOn(dashboardGuidedTourService.tour, 'init');
            dashboardGuidedTourService.init();
        });

        it('should call init', () => {
            expect(dashboardGuidedTourService.tour.init).toHaveBeenCalled();
        });
    });

    describe('start', () => {
        beforeEach(() => {
            spyOn(dashboardGuidedTourService.tour, 'start');
            dashboardGuidedTourService.start();
        });

        it('should call start', () => {
            expect(dashboardGuidedTourService.tour.start).toHaveBeenCalled();
        });
    });

    describe('end', () => {
        beforeEach(() => {
            spyOn(dashboardGuidedTourService.tour, 'end');
            dashboardGuidedTourService.end();
        });

        it('should call end', () => {
            expect(dashboardGuidedTourService.tour.end).toHaveBeenCalled();
        });
    });
});