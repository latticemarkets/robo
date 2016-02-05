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

    class riskDiversificationService {
        constructor() {

        }

        get polarChartOptions() {
            return { maintainAspectRatio: true, responsive: false };
        }

        prepareData(data) {
            return {
                labels: data.map(grade => grade.label),
                data: data.map(grade => grade.value)
            };
        }
    }

    angular
        .module('app')
        .service('riskDiversificationService', riskDiversificationService);
})();