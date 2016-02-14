/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 14/02/2016
*/

(() => {
    'use strict';

    class CriteriaService {
        constructor(notificationService, $http) {
            this.notificationService = notificationService;
            this.$http = $http;
        }

        criteria(callback) {
            this.$http.get('/api/criteria').then(callback, this.notificationService.apiError());
        }
    }

    angular
        .module('app')
        .service('CriteriaService', CriteriaService);
})();