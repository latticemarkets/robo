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

    class loansMaturityUtilsService {
        constructor($filter) {
            this.$filter = $filter;
        }

        chartOptions(identifier, preparedData, xs, width) {
            return {
                bindto: `#${identifier}`,
                data: {
                    xs: xs,
                    columns: preparedData,
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
                },

            };
        }

        extractDataForScatterChart(loans) {
            let preparedData = {};
            const today = moment();

            loans.forEach(loan => {
                const originator = this.fromCamelCaseToTitle(loan.originator);
                if (!preparedData[originator]) {
                    preparedData[originator] = this.initOriginator(originator);
                }

                var moment2 = moment(loan.maturityDate);
                var n = moment2.diff(today, 'months', true);
                preparedData[originator].x.push(this.round2Decimal(n));
                preparedData[originator].y.push(loan.intRate);
            });

            let columns = [];
            $.map(preparedData, originator => {
                columns.push(originator.x);
                columns.push(originator.y);
            });

            return columns;
        }

        extractXs(preparedData) {
            return preparedData
                .filter(axis => !this.endsWith(axis[0], '_x'))
                .map(axis => axis[0])
                .reduce((xs, originatorName) => {
                    xs[originatorName] = `${originatorName}_x`;
                    return xs;
                }, {});
        }

        fromCamelCaseToTitle(str) {
            const unCamelCased = this.$filter('camelCaseToHuman')(str);
            return this.$filter('titlecase')(unCamelCased);
        }

        round2Decimal(n) {
            return Math.round(n * 100) / 100;
        }

        initOriginator(name) {
            return {
                x: [`${name}_x`],
                y: [name]
            };
        }

        endsWith(str, suffix) {
            return str.indexOf(suffix, this.length - suffix.length) !== -1;
        }
    }

    angular
        .module('app')
        .service('loansMaturityUtilsService', loansMaturityUtilsService);
})();