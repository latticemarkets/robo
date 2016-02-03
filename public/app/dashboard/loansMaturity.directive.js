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

    loansMaturity.$inject = ['notificationService'];

    function loansMaturity(notificationService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                data: "=",
                identifier: "@"
            },
            template: '<div id="loansMaturity"></div>',
            link(scope) {
                scope.data.then(response => {
                    const prepared = extractDataForScatterChart(response.data);

                    const xs = prepared
                            .filter(axis => !axis[0].endsWith('_x'))
                            .map(axis => axis[0])
                            .reduce((xs, originatorName) => {
                                xs[originatorName] = `${originatorName}_x`;
                                return xs;
                            }, {});

                    const chart = c3.generate({
                        bindto: `#${scope.identifier}`,
                        data: {
                            xs: xs,
                            columns: prepared,
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
                }, notificationService.apiError());


                function extractDataForScatterChart(loans) {
                    let preparedData = {};
                    const today = moment();

                    loans.forEach(loan => {
                        const originator = loan.originator;
                        if (!preparedData[originator]) {
                            preparedData[originator] = initOriginator(originator);
                        }

                        var moment2 = moment(loan.maturityDate);
                        var n = moment2.diff(today, 'months', true);
                        preparedData[originator].x.push(round2Decimal(n));
                        preparedData[originator].y.push(loan.intRate);
                    });

                    let columns = [];
                    $.map(preparedData, originator => {
                        columns.push(originator.x);
                        columns.push(originator.y);
                    });

                    return columns;
                }

                function round2Decimal(n) {
                    return Math.round(n * 100) / 100;
                }

                function initOriginator(name) {
                    return {
                        x: [`${name}_x`],
                        y: [name]
                    };
                }
            }
        };
    }
})();