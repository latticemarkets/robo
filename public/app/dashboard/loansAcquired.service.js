/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 03/02/2016
*/

(() => {
    'use strict';

    class loansAcquiredService {
        constructor() {
        }

        get barChartOptions() {
            return {
                series: {
                    bars: {
                        show: true,
                        barWidth: 0.8,
                        fill: true,
                        fillColor: {
                            colors: [ { opacity: 1 }, { opacity: 1 } ]
                        },
                        lineWidth: 1
                    }
                },
                xaxis: {
                    tickDecimals: 0
                },
                colors: ["#1080f2"],
                grid: {
                    show: false
                },
                legend: {
                    show: false
                }
            };
        }

        prepareData(loansAcquiredPerDay) {
            return [
                {
                    label: "line",
                    data: loansAcquiredPerDay.map((n, i) => [i+1, n])
                }
            ];
        }
    }

    angular
        .module('app')
        .service('loansAcquiredService', loansAcquiredService);
})();