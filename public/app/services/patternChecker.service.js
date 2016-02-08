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

(() => {
    'use strict';

    class patternCheckerService {
        constructor() {

        }

        isEmail(str) {
            const regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
            return regex.test(str);
        }

        charLengthGreaterThan8(str) {
            if (str) {
                return str.length >= 8;
            }
            return false;
        }

        hasLowercase(str) {
            const regex = /^(?=.*[a-z]).+$/;
            return regex.test(str) && str !== undefined;
        }

        hasUppercase(str) {
            const regex = /^(?=.*[A-Z]).+$/;
            return regex.test(str);
        }

        hasSpecialChar(str) {
            const regex = /^(?=.*[0-9_\W]).+$/;
            return regex.test(str);
        }
    }

    angular
        .module('app')
        .service('patternCheckerService', patternCheckerService);
})();