/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 10/02/2016
*/

(() => {
    'use strict';

    class onResizeService {
        constructor() {
            this.callbackPool = [];
            window.onresize = () => this.callbackPool.forEach(callback => callback());
        }

        addOnResizeCallback(callback) {
            this.callbackPool.push(callback);
            return this.callbackPool.length - 1;
        }

        removeOnResizeCallback(index) {
            this.callbackPool.splice(index, 1);
        }
    }

    angular
        .module('app')
        .service('onResizeService', onResizeService);
})();