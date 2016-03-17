'use strict';

/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : bastienguerineau
* Created on 17/03/2016
*/

describe('module: app', function () {
    var $rootScope = undefined,
        responsiveService = undefined,
        $timeout = undefined;

    beforeEach(function () {
        module('app', function ($provide) {
            $provide.value('responsiveService', {
                adaptWrapperHeight: jasmine.createSpy('adaptWrapperHeight'),
                adaptSidebar: jasmine.createSpy('adaptSidebar')
            });
        });
        beforeEach(inject(function (_$rootScope_, _responsiveService_, _$timeout_) {
            $rootScope = _$rootScope_;
            responsiveService = _responsiveService_;
            $timeout = _$timeout_;
        }));
    });

    beforeEach(function () {
        $rootScope.$broadcast('$locationChangeSuccess');
        $timeout.flush();
    });

    it('should call adaptWrapperHeight and adaptSidebar', function () {
        expect(responsiveService.adaptWrapperHeight).toHaveBeenCalled();
        expect(responsiveService.adaptSidebar).toHaveBeenCalled();
    });
});
;
