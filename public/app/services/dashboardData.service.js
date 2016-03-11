/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
 * @author : julienderay
 * Created on 01/02/2016
 */

(() => {
    'use strict';

    class dashboardDataService {
        constructor($http, notificationService) {
            this.$http = $http;
            this.notificationService = notificationService;
        }

        portfolioMetrics(callback){
          const promise = this.$http.get('/api/dashboard/portfolioMetrics');
          promise.then(callback, this.notificationService.apiError());
          return promise;
        }
    }

    angular
        .module('app')
        .service('dashboardDataService', dashboardDataService);
})();
