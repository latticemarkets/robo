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
            return ['#1181F2', '#3498db', '#5799DA', '#0F428F', '#6eb2f7', '#1C9AD1'];
        }
    }

    angular
        .module('app')
        .service('chartService', chartService);
})();
