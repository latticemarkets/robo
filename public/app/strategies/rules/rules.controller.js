/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 11/02/2016
*/

(() => {
    'use strict';

    class RulesController {
        constructor($routeParams, constantsService, $location, cssInjector) {
            var vm = this;
            cssInjector.add("assets/stylesheets/homer_style.css");

            const platform = $routeParams.platform;
            if (!constantsService.platforms().some(realPlatform => {
                    console.debug(realPlatform);
                    console.debug(platform);
                    return realPlatform == platform;
                })) {
                $location.path('/strategies');
            }
        }
    }

    angular
        .module('app')
        .controller('RulesController', RulesController);
})();