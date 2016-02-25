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
        }

        prepareSplineChartColumns(values) {
            return [
                this.prepareSplineChartXValues(values.map(strategyReturn => strategyReturn.expectedReturn)),
                this.prepareSplineChartYValues(values.map(strategyReturn => strategyReturn.quantity))
            ];
        }

        prepareSplineChartYValues(yValues) {
            return ['distribution'].concat(yValues);
        }

        prepareSplineChartXValues(xValues) {
            return ['x'].concat(xValues);
        }

        splineChartOptions(id, initValues) {
            return {
                bindto: `#${id}`,
                data: {
                    xs: {
                        'distribution': 'x'
                    },
                    columns: this.prepareSplineChartColumns(initValues),
                    types: {
                        distribution: 'area-spline'
                    },
                    colors: {
                        'distribution': '#3498db'
                    }
                },
                axis: {
                    x: {
                        tick: {
                            format: v => `${v}%`,
                                values: [-10, -5, 0, 5, 10, 15, 20]
                        },
                        min: -10,
                            max: 20
                    },
                    y: {
                        show: false
                    }
                },
                point: {
                    r: 0
                },
                legend: {
                    show: false
                }
            };
        }

        barChartOptions(id, initValues) {
            return {
                bindto: `#${id}`,
                data: {
                    columns: initValues,
                    type: 'bar',
                    colors: {
                        'Estimated Loan Distribution': '#3498db'
                    }
                },
                axis: {
                    x: {
                        tick: {
                            format: v => `${['A', 'B', 'C', 'D', 'E', 'F', 'G'][v]}`
                        }
                    },
                    y: {
                        show: false
                    }
                },
                legend: {
                    item: {
                        onclick: () => {}
                    }
                },
                tooltip: {
                    show: false
                }
            };
        }
    }

    angular
        .module('app')
        .service('autoStrategyChartsService', autoStrategyChartsService);
})();