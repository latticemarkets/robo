/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 05/02/2016
*/

describe('patternChecker', () => {
    let patternCheckerService;

    beforeEach(module('app'));

    beforeEach(inject((_patternCheckerService_) => {
        patternCheckerService = _patternCheckerService_;
    }));

    describe('isEmail', () => {
        it('should pass', () => {
            expect(patternCheckerService.isEmail('toto@tata.fr')).toBeTruthy();
        });

        it('should fail without extendion', () => {
            expect(patternCheckerService.isEmail('toto@tata.')).toBeFalsy();
        });

        it('should fail without extension and point', () => {
            expect(patternCheckerService.isEmail('toto@tata')).toBeFalsy();
        });

        it('should fail without domain', () => {
            expect(patternCheckerService.isEmail('toto@.fr')).toBeFalsy();
        });

        it('should fail without @', () => {
            expect(patternCheckerService.isEmail('tototata.fr')).toBeFalsy();
        });

        it('should fail without suffix', () => {
            expect(patternCheckerService.isEmail('@tata.fr')).toBeFalsy();
        });
    });

    describe('charLengthGreaterThan8', () => {
        it('should pass', () => {
            expect(patternCheckerService.charLengthGreaterThan8('Str0ngPassword')).toBeTruthy();
        });

        it('should fail', () => {
            expect(patternCheckerService.charLengthGreaterThan8('Str0ng')).toBeFalsy();
        });
    });

    describe('hasLowercase', () => {
        it('should pass', () => {
            expect(patternCheckerService.hasLowercase('password')).toBeTruthy();
        });

        it('should fail', () => {
            expect(patternCheckerService.hasLowercase('PASSWORD')).toBeFalsy();
        });
    });

    describe('hasUppercase', () => {
        it('should pass', () => {
            expect(patternCheckerService.hasUppercase('PASSWORD')).toBeTruthy();
        });

        it('should fail', () => {
            expect(patternCheckerService.hasUppercase('password')).toBeFalsy();
        });
    });

    describe('hasSpecialChar', () => {
        it('should pass', () => {
            expect(patternCheckerService.hasSpecialChar('@')).toBeTruthy();
        });

        it('should pass', () => {
            expect(patternCheckerService.hasSpecialChar('.')).toBeTruthy();
        });

        it('should pass', () => {
            expect(patternCheckerService.hasSpecialChar('-')).toBeTruthy();
        });

        it('should pass', () => {
            expect(patternCheckerService.hasSpecialChar('+')).toBeTruthy();
        });

        it('should pass', () => {
            expect(patternCheckerService.hasSpecialChar(',')).toBeTruthy();
        });

        it('should fail', () => {
            expect(patternCheckerService.hasSpecialChar('password')).toBeFalsy();
        });
    });
});
