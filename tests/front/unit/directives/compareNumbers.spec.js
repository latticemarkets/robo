/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 02/02/2016
*/

describe('directive: compare-numbers', function() {
    let element,
        scope,
        $timeout;

    beforeEach(module('app'));

    beforeEach(inject(function($rootScope, $compile, _$timeout_) {
        $timeout = _$timeout_;
        scope = $rootScope.$new();

        element = '<compare-numbers compare="compared" to="goal">{{ currentRoiRate }}</compare-numbers>';
        element = $compile(element)(scope);
    }));

    describe('compared < goal', () => {
        beforeEach(() => {
            scope.compared = 100;
            scope.goal = 120;

            scope.$digest();
        });

        it('should be red', () => {
            const isolateScope = element.isolateScope();
            $timeout.flush();
            expect(isolateScope.result).toBe('text-danger');
        });
    });

    describe('compared >= goal', () => {
        beforeEach(() => {
            scope.compared = 100;
            scope.goal = 90;

            scope.$digest();
        });

        it('should be green', () => {
            const isolateScope = element.isolateScope();
            $timeout.flush();
            expect(isolateScope.result).toBe('text-success');
        });
    });
});