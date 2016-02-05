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
            return this.prepareData(data, 'originator', 'loansAcquired');
        }

        prepareRiskDiversificationData(data) {
            return this.prepareData(data, 'grade', 'value');
        }

        prepareData(data, labelsKey, valuesKey) {
            return data.map(elem => {
                const unCamelCased = this.$filter('camelCaseToHuman')(elem[labelsKey]);
                const titleCased = this.$filter('titlecase')(unCamelCased);
                return [ titleCased, elem[valuesKey] ];
            });
        }

        get blueDegraded() {
            return ['#083D72', '#5AA7F4', '#1181F2', '#2A4E72', '#0D66BF', '#3994F2', '#65AAF2'];
        }
    }

    angular
        .module('app')
        .service('c3PieChartService', c3PieChartService);
})();
