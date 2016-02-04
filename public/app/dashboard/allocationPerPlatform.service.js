/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 04/02/2016
*/

(() => {
    'use strict';

    class allocationPerPlatformService {
        constructor($filter) {
            this.$filter = $filter;
        }

        prepareData(data) {
            return data.map(allocation => {
                const unCamelCased = this.$filter('camelCaseToHuman')(allocation.originator);
                const titleCased = this.$filter('titlecase')(unCamelCased);
                return [ titleCased, allocation.loansAcquired ];
            });
        }
    }

    angular
        .module('app')
        .service('allocationPerPlatformService', allocationPerPlatformService);
})();