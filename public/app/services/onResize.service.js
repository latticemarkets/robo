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
            this.theCallbackPool = {};
            window.onresize = this.runCallbacks();
        }

        runCallbacks() {
            return () => $.map(this.theCallbackPool, (callback => callback()));
        }

        get callbackPool() {
            return this.theCallbackPool;
        }

        addOnResizeCallback(callback, id) {
            this.theCallbackPool[id] = callback;
        }

        removeOnResizeCallback(id) {
            delete this.theCallbackPool[id];
        }
    }

    angular
        .module('app')
        .service('onResizeService', onResizeService);
})();