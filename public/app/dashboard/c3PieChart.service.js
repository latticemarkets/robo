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

    class c3PieChartService {
        constructor($filter) {
            this.$filter = $filter;
        }

        preparePlatformAllocationData(data) {
            return data.map(allocation => {
                const unCamelCased = this.$filter('camelCaseToHuman')(allocation.originator);
                const titleCased = this.$filter('titlecase')(unCamelCased);
                return [ titleCased, allocation.loansAcquired ];
            });
        }

        prepareRiskDiversificationData(data) {
            return data.map(allocation => {
                const unCamelCased = this.$filter('camelCaseToHuman')(allocation.grade);
                const titleCased = this.$filter('titlecase')(unCamelCased);
                return [ titleCased, allocation.value ];
            });
        }

        get blueDegraded() {
            return ['#0000CC', '#222BD5', '#4455DD', '#6680E6', '#88AAEE', '#AAD5F7', '#CCFFFF'];
        }
    }

    angular
        .module('app')
        .service('c3PieChartService', c3PieChartService);
})();
