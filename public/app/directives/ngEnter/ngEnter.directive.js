/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 26/02/2016
*/

(() => {
    'use strict';

    angular
        .module('app')
        .directive('ngEnter', () =>
            (scope, elements, attrs) =>
                elements.bind('keydown keypress', event => {
                    if (event.which === 13) {
                        scope.$apply(() => scope.$eval(attrs.ngEnter));
                        event.preventDefault();
                    }
                })
        );
})();