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
        constructor(notificationService, $http) {
            this.notificationService = notificationService;
            this.$http = $http;
        }

        expendCriteriaObject(rule) {
            rule.criteria = rule.criteria
                .map(criterion => {
                    switch (criterion.typeKey) {
                        case 'newAccounts':
                            criterion.value = parseInt(criterion.value);
                            criterion.slider = {};
                            criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                            criterion.slider.min = 0;
                            criterion.slider.max = 10;
                            criterion.slider.format = value => {
                                if (value === criterion.slider.min) {
                                    return `No account`;
                                }
                                else if (value === 1) {
                                    return `No more than ${value} account`;
                                }
                                else if (value > 1 && value < criterion.slider.max) {
                                    return `No more than ${value} accounts`;
                                }
                                else if (value === criterion.slider.max) {
                                    return `No limit`;
                                }
                                else {
                                    return `Error`;
                                }
                            };
                            return criterion;
                        case 'maxDebtIncomeWithLoan':
                            criterion.value = criterion.value * 100;
                            criterion.slider = {};
                            criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                            criterion.slider.min = 10;
                            criterion.slider.max = 40;
                            criterion.slider.format = value => {
                                if (value >= criterion.slider.min && value <= criterion.slider.max) {
                                    return `No more than ${value}`;
                                }
                                else {
                                    return `Error`;
                                }
                            };
                            return criterion;
                        case 'totalCreditLines':
                            criterion.value = parseInt(criterion.value);
                            criterion.slider = {};
                            criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                            criterion.slider.min = 10;
                            criterion.slider.max = 40;
                            criterion.slider.step = 10;
                            criterion.slider.format = value => {
                                if (value >= criterion.slider.min && value < criterion.slider.max) {
                                    return `Up to ${value} credit lines`;
                                }
                                else if (value === criterion.slider.max) {
                                    return `Any number`;
                                }
                                else {
                                    return `Error`;
                                }
                            };
                            return criterion;
                        case 'maxDelinquencies':
                            criterion.value = parseInt(criterion.value);
                            criterion.slider = {};
                            criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                            criterion.slider.min = 0;
                            criterion.slider.max = 6;
                            criterion.slider.step = 1;
                            criterion.slider.format = value => {
                                if (value === 0) {
                                    return `No delinquencies`;
                                }
                                if (value > criterion.slider.min && value < criterion.slider.max) {
                                    return `No more than ${value} delinquencies`;
                                }
                                else if (value === criterion.slider.max) {
                                    return `Any number of delinquencies`;
                                }
                                else {
                                    return `Error`;
                                }
                            };
                            return criterion;
                        case 'earliestCreditLine':
                            criterion.value = parseInt(criterion.value);
                            criterion.slider = {};
                            criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                            criterion.slider.min = 0;
                            criterion.slider.max = 10;
                            criterion.slider.step = 1;
                            criterion.slider.format = value => {
                                if (value === 0) {
                                    return `Any`;
                                }
                                if (value > criterion.slider.min && value <= criterion.slider.max) {
                                    return `At least ${value} years`;
                                }
                                else {
                                    return `Error`;
                                }
                            };
                            return criterion;
                        default:
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
                { typeKey: 'maxDelinquencies', name: 'Maximum Delinquencies' },
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