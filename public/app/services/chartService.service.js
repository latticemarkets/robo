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

(() => {
    'use strict';

    class chartService {
        constructor() {
        }

        get blueDegraded() {
            return ['#1181F2', '#248bf3', '#3695f4', '#499ff5', '#5ba8f6', '#6eb2f7', '#93c6f9'];
        }
    }

    angular
        .module('app')
        .service('chartService', chartService);
})();