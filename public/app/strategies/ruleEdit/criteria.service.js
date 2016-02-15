/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 14/02/2016
*/

(() => {
    'use strict';

    class CriteriaService {
        constructor(notificationService, $http, $filter) {
            this.notificationService = notificationService;
            this.$http = $http;
            this.$filter = $filter;
        }

        expendCriteriaObject(rule) {
            rule.criteria = rule.criteria
                .map(criterion => {
                    switch (criterion.typeKey) {
                        case 'newAccounts':
                            criterion.slider = {};
                            criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                            criterion.slider.min = 0;
                            criterion.slider.max = 10;
                            criterion.slider.format = value => {
                                if (value === 0) {
                                    return `No account`;
                                }
                                else if (value === 1) {
                                    return `No more than ${value} account`;
                                }
                                else if (value > 1 && value < 10) {
                                    return `No more than ${value} accounts`;
                                }
                                else if (value === 10) {
                                    return `No limit`;
                                }
                                else {
                                    return `Error`;
                                }
                            };
                            return criterion;
                        case 'maxDebtIncomeWithLoan':
                            criterion.slider = {};
                            criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                            criterion.slider.min = 0.1;
                            criterion.slider.max = 0.4;
                            criterion.slider.step = 0.1;
                            criterion.slider.format = value => {
                                if (value >= 0.1 && value <= 0.4) {
                                    return `No more than ${this.$filter('percent')(value, 0)}`;
                                }
                                else {
                                    return `Error`;
                                }
                            };
                            return criterion;
                        default:
                            console.log('Unknown criteria');
                            return undefined;
                    }
                })
                .filter(criterion => criterion);
            return rule;
        }

        getCriteriaName(typeKey) {
            let name;
            if (this.baseCriteria.some(baseCriterion => {
                if (baseCriterion.typeKey == typeKey) {
                    name = baseCriterion.name;
                    return true;
                }
            })) {
                return name;
            }
            else {
                return undefined;
            }
        }

        get baseCriteria() {
            return [
                { typeKey: 'newAccounts', name: 'New Accounts (24 months)' },
                { typeKey: 'totalCreditLines', name: 'Total Credit Lines' },
                { typeKey: 'creditScore', name: 'Credit Score' },
                { typeKey: 'delinquencies', name: 'Delinquencies' },
                { typeKey: 'earliestCreditLine', name: 'Earliest Credit Line' },
                { typeKey: 'employmentLength', name: 'Employment Length' },
                { typeKey: 'jobTitle', name: 'Job Title' },
                { typeKey: 'homeOwnership', name: 'Home Ownership' },
                { typeKey: 'inquiries', name: 'Inquiries' },
                { typeKey: 'loanPaymentIncome', name: 'Loan Payment Income' },
                { typeKey: 'verifiedIncome', name: 'Verified Income' },
                { typeKey: 'loanAmount', name: 'Loan Amount' },
                { typeKey: 'maxDebtIncome', name: 'Max Debt / Income' },
                { typeKey: 'maxDebtIncomeWithLoan', name: 'Max Debt / Income with Loan' },
                { typeKey: 'monthlyIncome', name: 'Monthly Income' },
                { typeKey: 'lastDelinquency', name: 'Last Delinquency' },
                { typeKey: 'lastRecord', name: 'Last Record' },
                { typeKey: 'openCreditLine', name: 'Open Credit Line' },
                { typeKey: 'publicRecords', name: 'Public Records' },
                { typeKey: 'loanPurpose', name: 'Loan Purpose' },
                { typeKey: 'revolvingUtilization', name: 'Revolving Utilization' },
                { typeKey: 'expectedReturn', name: 'Expected Return' },
                { typeKey: 'highestExpectedReturn', name: 'Highest Expected Return' },
                { typeKey: 'state', name: 'State' },
                { typeKey: 'subGrade', name: 'Sub Grade' },
                { typeKey: 'term', name: 'Term' },
                { typeKey: 'loanPopularity', name: 'Loan Popularity' }
            ];
        }
    }

    angular
        .module('app')
        .service('CriteriaService', CriteriaService);
})();