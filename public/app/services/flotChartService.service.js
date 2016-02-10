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

    class flotChartService {
        constructor($filter) {
            this.$filter = $filter;
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

        get pieChartOptions() {
            const formatter = value => {
                const unCamelCased = this.$filter('camelCaseToHuman')(value);
                return this.$filter('titlecase')(unCamelCased);
            };

            return {
                series: {
                    pie: {
                        show: true,
                        radius: 1,
                        label: {
                            show: true,
                            radius: 3/4,
                            formatter: formatter,
                            background: {
                                color: "#fff",
                                opacity: 0.5
                            }
                        }
                    }
                },
                legend: {
                    show: false
                }
            };
        }

        get donutChartOptions() {
            const formatter = value => {
                const unCamelCased = this.$filter('camelCaseToHuman')(value);
                return this.$filter('titlecase')(unCamelCased);
            };

            return {
                series: {
                    pie: {
                        show: true,
                        radius: 1,
                        label: {
                            show: true,
                            radius: 3/4,
                            formatter: formatter,
                            background: {
                                color: "#fff",
                                opacity: 0.5
                            }
                        },
                        innerRadius: 0.7
                    }
                },
                legend: {
                    show: false
                }
            };
        }

        prepareDataRiskDiversification(riskDiversification) {
            return riskDiversification.map((grade, i) => ({ label: grade.grade, data: grade.value, color: this.blueDegraded[i] }));
        }

        prepareDataLoansAcquiredPerDay(loansAcquiredPerDay) {
            return [
                {
                    label: "line",
                    data: loansAcquiredPerDay.map((n, i) => [i+1, n])
                }
            ];
        }

        get blueDegraded() {
            return ['#1181F2', '#248bf3', '#3695f4', '#499ff5', '#5ba8f6', '#6eb2f7', '#93c6f9'];
        }

        prepareDataPlatformAllocation(platformAllocation) {
            return platformAllocation.map((platform, i) => ({ label: platform.originator, data: platform.loansAcquired, color: this.blueDegraded[i] }));
        }
    }

    angular
        .module('app')
        .service('flotChartService', flotChartService);
})();