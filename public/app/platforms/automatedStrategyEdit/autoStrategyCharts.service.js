/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 22/02/2016
*/

(() => {
    'use strict';

    class autoStrategyChartsService {
        constructor() {
            this.barChartData = [
                [['Estimated Loan Distribution', 0.1, 10, 0, 0, 0, 0, 0]],
                [['Estimated Loan Distribution', 0.1, 10, 0, 0.2, 0, 0, 0]],
                [['Estimated Loan Distribution', 0.1, 10, 0.15, 0.3, 0.2, 0, 0]],
                [['Estimated Loan Distribution', 0.1, 10, 0.3, 1, 0.5, 0.1, 0]],
                [['Estimated Loan Distribution', 0.1, 10, 0.6, 2, 1, 0.3, 0]],
                [['Estimated Loan Distribution', 0.1, 10, 0.9, 5, 2.5, 0.4, 0]],
                [['Estimated Loan Distribution', 0.1, 10, 1.4, 7.5, 3.2, 0.6, 0]],
                [['Estimated Loan Distribution', 0, 8, 2.5, 10, 3.5, 0.7, 0]],
                [['Estimated Loan Distribution', 0, 5, 3, 10, 5, 0.7, 0]],
                [['Estimated Loan Distribution', 0, 2, 3, 10, 5, 0.7, 0]],
                [['Estimated Loan Distribution', 0, 0, 3, 10, 5, 0.7, 0]]
            ];
        }

        simulatedBarChartDataForStrategy(n) {
            return (n < this.barChartData.length && n > 0) ? this.barChartData[n] : [];
        }
    }

    angular
        .module('app')
        .service('autoStrategyChartsService', autoStrategyChartsService);
})();