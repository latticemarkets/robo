/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 26/02/2016
*/

describe('autoStrategyChartsService', () => {
    beforeEach(module('app'));

    let autoStrategyChartsService;
    beforeEach(inject((_autoStrategyChartsService_) => {
        autoStrategyChartsService = _autoStrategyChartsService_;
    }));

    describe('getSplineChartValuesFromSlider', () => {
        let sliderValue,
            strategyReturns,
            simulationSteps,
            result;
        beforeEach(() => {
            sliderValue = 0;
            strategyReturns = 'strategyReturns1';
            simulationSteps = [{strategyReturns: strategyReturns}];

            result = autoStrategyChartsService.getSplineChartValuesFromSlider(sliderValue, simulationSteps);
        });

        it('should return the good strategy return', () => {
            expect(result).toBe(strategyReturns);
        });
    });

    describe('getBarChartValuesFromSlider', () => {
        let sliderValue,
            portfolioComposition,
            simulationSteps,
            result,
            gradeA,
            gradeB;

        beforeEach(() => {
            sliderValue = 0;
            gradeA = 'gradeA';
            gradeB = 'gradeB';
            portfolioComposition = {gradeA: gradeA, gradeB: gradeB};
            simulationSteps = [{portfolioComposition: portfolioComposition}];

            result = autoStrategyChartsService.getBarChartValuesFromSlider(sliderValue, simulationSteps);
        });

        it('should return the good grade values', () => {
            expect(result).toEqual([gradeA, gradeB]);
        });
    });

    describe('getSplineChartOptions', () => {
        let sliderValue,
            simulationSteps,
            splineChartId,
            strategyReturns,
            result,
            expectedResult,
            quantity,
            expectedReturn;

        beforeEach(() => {
            sliderValue = 0;
            splineChartId = 'id';
            expectedReturn = 2;
            quantity = 3;
            strategyReturns = {expectedReturn: expectedReturn, quantity: quantity};
            simulationSteps = [{strategyReturns: [strategyReturns]}];
            expectedResult = {
                bindto: `#${splineChartId}`,
                data: {
                    xs: {
                        'distribution': 'x'
                    },
                    columns: [['x', expectedReturn], ['distribution', quantity]],
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
                            format: jasmine.any(Function),
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

            result = autoStrategyChartsService.getSplineChartOptions(sliderValue, splineChartId, simulationSteps);
        });

        it('should return the good spline chart options', () => {
            expect(result).toEqual(expectedResult);
        });
    });

    describe('getBarChartOptions', () => {
        let sliderValue,
            barChartId,
            simulationSteps,
            gradeA,
            gradeB,
            portfolioComposition,
            result,
            expectedResult;

        beforeEach(() => {
            sliderValue = 0;
            barChartId = 'id';
            gradeA = 1;
            gradeB = 2;
            portfolioComposition = {gradeA: gradeA, gradeB: gradeB};
            simulationSteps = [{portfolioComposition: portfolioComposition}];
            expectedResult = {
                bindto: `#${barChartId}`,
                data: {
                    columns: [['Estimated Loan Distribution', gradeA, gradeB]],
                    type: 'bar',
                    colors: {
                        'Estimated Loan Distribution': '#3498db'
                    }
                },
                axis: {
                    x: {
                        tick: {
                            format: jasmine.any(Function)
                        }
                    },
                    y: {
                        show: false
                    }
                },
                legend: {
                    item: {
                        onclick: jasmine.any(Function)
                    }
                },
                tooltip: {
                    show: false
                }
            };

            result = autoStrategyChartsService.getBarChartOptions(sliderValue, barChartId, simulationSteps);
        });

        it('should return the good bar chart options', () => {
            expect(result).toEqual(expectedResult);
        });
    });

    describe('prepareSplineChartColumns', () => {
        let sliderValue,
            simulationSteps,
            expectedReturn,
            quantity,
            strategyReturns,
            expectedResult,
            result;

        beforeEach(() => {
            sliderValue = 0;
            expectedReturn = 2;
            quantity = 3;
            strategyReturns = {expectedReturn: expectedReturn, quantity: quantity};
            simulationSteps = [{strategyReturns: [strategyReturns]}];
            expectedResult = [['x', 2], ['distribution', 3]];

            result = autoStrategyChartsService.prepareSplineChartColumns(sliderValue, simulationSteps);
        });

        it('should return the prepared columns', () => {
            expect(result).toEqual(expectedResult);
        });
    });

    describe('prepareSplineChartYValues', () => {
        let yValues,
            yValue,
            expectedResult,
            result;

        beforeEach(() => {
            yValue = 1;
            yValues = [yValue];
            expectedResult = ['distribution', yValue];

            result = autoStrategyChartsService.prepareSplineChartYValues(yValues);
        });

        it('should return the values concat to data description', () => {
            expect(result).toEqual(expectedResult);
        });
    });

    describe('prepareSplineChartXValues', () => {
        let xValues,
            xValue,
            expectedResult,
            result;

        beforeEach(() => {
            xValue = 1;
            xValues = [xValue];
            expectedResult = ['x', xValue];

            result = autoStrategyChartsService.prepareSplineChartXValues(xValues);
        });

        it('should return the values concat to data description', () => {
            expect(result).toEqual(expectedResult);
        });
    });

    describe('prepareBarChartColumn', () => {
        let sliderValue,
            simulationSteps,
            expectedResult,
            result,
            gradeA,
            gradeB,
            portfolioComposition;

        beforeEach(() => {
            sliderValue = 0;
            gradeA = 1;
            gradeB = 2;
            portfolioComposition = {gradeA: gradeA, gradeB: gradeB};
            simulationSteps = [{portfolioComposition: portfolioComposition}];
            expectedResult = [['Estimated Loan Distribution', gradeA, gradeB]];

            result = autoStrategyChartsService.prepareBarChartColumn(sliderValue, simulationSteps);
        });

        it('should return the prepared values', () => {
            expect(result).toEqual(expectedResult);
        });
    });

    describe('generateSplineChartOptions', () => {
        let id,
            values,
            result,
            expectedResult;

        beforeEach(() => {
            id = 'id';
            values = [['x', 9, 8]];
            expectedResult = {
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
                            format: jasmine.any(Function),
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

            result = autoStrategyChartsService.generateSplineChartOptions(id, values);
        });

        it('should return the spline chart options', () => {
            expect(result).toEqual(expectedResult);
        });
    });

    describe('barChartOptions', () => {
        let id,
            values,
            result,
            expectedResult;

        beforeEach(() => {
            id = 'id';
            values = [['loans', 9, 8]];
            expectedResult = {
                bindto: `#${id}`,
                data: {
                    columns: values,
                    type: 'bar',
                    colors: {
                        'Estimated Loan Distribution': '#3498db'
                    }
                },
                axis: {
                    x: {
                        tick: {
                            format: jasmine.any(Function)
                        }
                    },
                    y: {
                        show: false
                    }
                },
                legend: {
                    item: {
                        onclick: jasmine.any(Function)
                    }
                },
                tooltip: {
                    show: false
                }
            };

            result = autoStrategyChartsService.barChartOptions(id, values);
        });

        it('should return the spline chart options', () => {
            expect(result).toEqual(expectedResult);
        });
    });
});