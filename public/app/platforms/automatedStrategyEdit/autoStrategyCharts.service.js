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

        getSplineChartValuesFromSlider(sliderValue, simulationSteps) {
            return simulationSteps[sliderValue].strategyReturns;
        }

        getBarChartValuesFromSlider(sliderValue, simulationSteps) {
            return $.map(simulationSteps[sliderValue].portfolioComposition, elem => elem);
        }

        getSplineChartOptions(sliderValue, splineChartId, simulationSteps) {
            return this.generateSplineChartOptions(splineChartId, this.prepareSplineChartColumns(sliderValue, simulationSteps));
        }

        getBarChartOptions(sliderValue, barChartId, simulationSteps) {
            return this.barChartOptions(barChartId, this.prepareBarChartColumn(sliderValue, simulationSteps));
        }

        prepareSplineChartColumns(sliderValue, simulationSteps) {
            const stepValues = this.getSplineChartValuesFromSlider(sliderValue, simulationSteps);
            return [
                this.prepareSplineChartXValues(Array.apply(null, new Array(40)).map((x, i) => i-10 )),
                this.prepareSplineChartYValues(stepValues.map(strategyReturn => strategyReturn.value))
            ];
        }

        prepareSplineChartYValues(yValues) {
            return ['distribution'].concat(yValues);
        }

        prepareSplineChartXValues(xValues) {
            return ['x'].concat(xValues);
        }

        prepareBarChartColumn(sliderValue, simulationSteps) {
            const stepValues = this.getBarChartValuesFromSlider(sliderValue, simulationSteps);
            return [['Estimated Loan Distribution'].concat(stepValues)];
        }

        generateSplineChartOptions(id, values) {
            return {
                bindto: `#${id}`,
                data: {
                    xs: {
                        'distribution': 'x'
                    },
                    columns: values,
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
                        show: false,
                        min: 2
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