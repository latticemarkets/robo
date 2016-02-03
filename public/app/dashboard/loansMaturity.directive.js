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

    angular
        .module('app')
        .directive('loansMaturity', loansMaturity);

    loansMaturity.$inject = [];

    function loansMaturity() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                data: "=",
                identifier: "@"
            },
            template: '<div id="loansMaturity"></div>',
            link(scope) {
                const values = scope.data.map(originator => extractDataForScatterChart(originator.data, originator.name));

                const chart = c3.generate({
                    bindto: `#${scope.identifier}`,
                    data: {
                        xs: scope.data.reduce((xs, loan) => {
                            xs[loan.name] = `${loan.name}_x`;
                            return xs;
                        }, {}),
                        columns: values.reduce((last, current) => last.concat([current.x, current.y]), []),
                        type: 'scatter'
                    },
                    axis: {
                        x: {
                            label: 'Months',
                            tick: {
                                fit: false
                            }
                        },
                        y: {
                            label: 'Interest rate',
                            tick: {
                                format: d3.format(",%")
                            }
                        }
                    },
                    point: {
                        r: 10
                    },
                    tooltip: {
                        format: {
                            title: months => `Mature in ${months} months`
                        }
                    }
                });

                function extractDataForScatterChart(loans, name) {
                    let xValues = [`${name}_x`],
                        yValues = [name];
                    const today = moment().startOf('day');

                    loans.forEach(loan => {
                        var monthsFromNow = round2Decimal(moment(loan.maturityDate, 'dd/MM/yyyy').diff(today, 'months', true));

                        xValues.push(monthsFromNow);
                        yValues.push(loan.intRate);
                    });

                    return { x: xValues, y: yValues};
                }

                function round2Decimal(n) {
                    return Math.round(n * 100) / 100;
                }
            }
        };
    }
})();