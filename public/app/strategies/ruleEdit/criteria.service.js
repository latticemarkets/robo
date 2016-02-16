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

    class criteriaService {
        constructor(notificationService, $http, $filter) {
            this.notificationService = notificationService;
            this.$http = $http;
            this.$filter = $filter;

            const grades = "ABCDEFG".split('');
            this.subGrades = grades.reduce((prev, grade) => {
                for (var i = 0; i < 5; i++) {
                    prev.push(`${grade}${i+1}`);
                }
                return prev;
            }, []);
        }

        unexpendCriteriaObject(rule) {
            const tmpsRule = JSON.parse(JSON.stringify(rule));
            return tmpsRule.criteria.map(criterion => {
                if (criterion.typeKey === 'subGrade') {
                    criterion.value = this.convertNumberToSubGrade(criterion.value);
                    criterion.highValue = this.convertNumberToSubGrade(criterion.highValue);
                }

                if (criterion.type === 'rangeSlider') {
                    criterion.value = `${criterion.value}-${criterion.highValue}`;
                    delete criterion.highValue;
                    delete criterion.slider;
                }
                else if (criterion.type === 'multi') {
                    criterion.value = JSON.stringify(criterion.value);
                }

                if (criterion.typeKey === 'maxDebtIncomeWithLoan') {
                    criterion.value = criterion.value / 100;
                }

                delete criterion[criterion.type];
                delete criterion.type;
                delete criterion.name;

                return criterion;
            });
        }

        expendCriteriaObject(rule) {
            rule.criteria = rule.criteria
                .map(criterion => this.expendCriterion(criterion))
                .filter(criterion => criterion);
            return rule;
        }

        expendCriterion(criterion) {
            let splitValue;

            switch (criterion.typeKey) {
                case 'newAccounts':
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 5;
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
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? criterion.value * 100 : 30;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 10;
                    criterion.slider.max = 40;
                    criterion.slider.format = value => {
                        if (value >= criterion.slider.min && value <= criterion.slider.max) {
                            return `No more than ${value}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'totalCreditLines':
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 30;
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
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 3;
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
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 4;
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
                case 'employmentLength':
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 5;
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
                case 'inquiries':
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 5;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 0;
                    criterion.slider.max = 10;
                    criterion.slider.step = 1;
                    criterion.slider.format = value => {
                        if (value === 0) {
                            return `No enquiry`;
                        }
                        if (value === 1) {
                            return `No more than 1 enquiry`;
                        }
                        if (value > 1 && value <= criterion.slider.max) {
                            return `No more than ${value} enquiries`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'loanPaymentIncome':
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 12;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 3;
                    criterion.slider.max = 20;
                    criterion.slider.step = 1;
                    criterion.slider.format = value => {
                        if (value >= criterion.slider.min && value <= criterion.slider.max) {
                            return `No more than ${value}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'maxDebtIncome':
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 25;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 10;
                    criterion.slider.max = 40;
                    criterion.slider.step = 1;
                    criterion.slider.format = value => {
                        if (value >= criterion.slider.min && value <= criterion.slider.max) {
                            return `No more than ${value}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'lastDelinquency':
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 30;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 0;
                    criterion.slider.max = 60;
                    criterion.slider.step = 1;
                    criterion.slider.format = value => {
                        if (value === criterion.slider.min) {
                            return 'Any';
                        }
                        else if (value === 1) {
                            return `1 month and more`;
                        }
                        else if (value > 1 && value <= criterion.slider.max) {
                            return `${value} months and more`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'lastRecord':
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 30;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 0;
                    criterion.slider.max = 60;
                    criterion.slider.step = 1;
                    criterion.slider.format = value => {
                        if (value === criterion.slider.min) {
                            return 'Any';
                        }
                        else if (value === 1) {
                            return `1 month and more`;
                        }
                        else if (value > 1 && value <= criterion.slider.max) {
                            return `${value} months and more`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'publicRecords':
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 3;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 0;
                    criterion.slider.max = 5;
                    criterion.slider.step = 1;
                    criterion.slider.format = value => {
                        if (value === criterion.slider.min) {
                            return 'No public record';
                        }
                        else if (value === 1) {
                            return `No more than 1 public record`;
                        }
                        else if (value > 1 && value < criterion.slider.max) {
                            return `No more than ${value} public records`;
                        }
                        else if (value === criterion.slider.max) {
                            return 'Any public records';
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'revolvingUtilization':
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 50;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 0;
                    criterion.slider.max = 100;
                    criterion.slider.step = 1;
                    criterion.slider.format = value => {
                        if (value >= criterion.slider.min && value <= criterion.slider.max) {
                            return `No more than ${value}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'expectedReturn':
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 10;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 0;
                    criterion.slider.max = 20;
                    criterion.slider.step = 1;
                    criterion.slider.format = value => {
                        if (value >= criterion.slider.min && value <= criterion.slider.max) {
                            return `${value}% and above`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'highestExpectedReturn':
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 50;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 0;
                    criterion.slider.max = 100;
                    criterion.slider.step = 1;
                    criterion.slider.format = value => {
                        if (value >= criterion.slider.min && value <= criterion.slider.max) {
                            return `Top ${value}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'loanPopularity':
                    criterion.type = 'slider';
                    criterion.value = criterion.value ? parseInt(criterion.value) : 50;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 0;
                    criterion.slider.max = 100;
                    criterion.slider.step = 1;
                    criterion.slider.format = value => {
                        if (value >= criterion.slider.min && value <= criterion.slider.max) {
                            return `Top ${value}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'creditScore':
                    criterion.type = 'rangeSlider';
                    splitValue = criterion.value ? criterion.value.split('-') : [700, 800];
                    criterion.value = splitValue[0];
                    criterion.highValue = splitValue[1];
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 660;
                    criterion.slider.max = 850;
                    criterion.slider.step = 5;
                    criterion.slider.format = (value, highValue) => {
                        if (value >= criterion.slider.min && highValue <= criterion.slider.max) {
                            return `Between ${value} and ${highValue}`;
                        }
                        else if (value === highValue) {
                            return value;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'monthlyIncome':
                    criterion.type = 'rangeSlider';
                    splitValue = criterion.value ? criterion.value.split('-') : [4000, 15000];
                    criterion.value = splitValue[0];
                    criterion.highValue = splitValue[1];
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 500;
                    criterion.slider.max = 20000;
                    criterion.slider.step = 500;
                    criterion.slider.format = (value, highValue) => {
                        if (value >= criterion.slider.min && highValue < criterion.slider.max) {
                            return `From ${this.$filter('currency')(value)} to ${this.$filter('currency')(highValue)}`;
                        }
                        else if (highValue === criterion.slider.max) {
                            return `${this.$filter('currency')(value)} and up`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'openCreditLine':
                    criterion.type = 'rangeSlider';
                    splitValue = criterion.value ? criterion.value.split('-') : [4, 12];
                    criterion.value = splitValue[0];
                    criterion.highValue = splitValue[1];
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 0;
                    criterion.slider.max = 30;
                    criterion.slider.step = 1;
                    criterion.slider.format = (value, highValue) => {
                        if (value === criterion.slider.min && highValue === criterion.slider.min) {
                            return `No line`;
                        }
                        if (value === 1 && highValue === 1) {
                            return `1 line`;
                        }
                        else if (value >= criterion.slider.min && highValue < criterion.slider.max) {
                            return `From ${value} to ${highValue} lines`;
                        }
                        else if (value === highValue) {
                            return `${value} lines`;
                        }
                        else if (highValue === criterion.slider.max) {
                            return `From ${value} to any number of lines`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'subGrade':
                    criterion.type = 'rangeSlider';
                    splitValue = criterion.value ? criterion.value.split('-') : ['A3', 'B4'];
                    criterion.value = this.convertSubGradeToNumber(splitValue[0]);
                    criterion.highValue = this.convertSubGradeToNumber(splitValue[1]);
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.typeKey);
                    criterion.slider.min = 0;
                    criterion.slider.max = 34;
                    criterion.slider.step = 1;
                    criterion.slider.format = (value, highValue) => {
                        if (value === highValue) {
                            return `${this.convertNumberToSubGrade(value)} only`;
                        }
                        else if (value >= criterion.slider.min && highValue <= criterion.slider.max) {
                            return `From ${this.convertNumberToSubGrade(value)} to ${this.convertNumberToSubGrade(highValue)}`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'loanPurpose':
                    criterion.type = 'multi';
                    criterion.value = criterion.value ? JSON.parse(criterion.value) : this.loansPurposes;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.typeKey);
                    criterion.multi.list = this.loansPurposes;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        const firsts = tmpValues.splice(0, 5);
                        return firsts.length ? `${firsts.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)} ${tmpValues.length ? `and ${tmpValues.length} others` : ''}` : 'Any';
                    };
                    return criterion;
                case 'homeOwnership':
                    criterion.type = 'multi';
                    criterion.value = criterion.value ? JSON.parse(criterion.value) : this.homeOwnerships;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.typeKey);
                    criterion.multi.list = this.homeOwnerships;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return criterion;
                case 'verifiedIncome':
                    criterion.type = 'multi';
                    criterion.value = criterion.value ? JSON.parse(criterion.value) : this.verifiedIncomes;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.typeKey);
                    criterion.multi.list = this.verifiedIncomes;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return criterion;
                case 'state':
                    criterion.type = 'multi';
                    criterion.value = criterion.value ? JSON.parse(criterion.value) : this.states;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.typeKey);
                    criterion.multi.list = this.states;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return criterion;
                case 'term':
                    criterion.type = 'multi';
                    criterion.value = criterion.value ? JSON.parse(criterion.value) : this.terms;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.typeKey);
                    criterion.multi.list = this.terms;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return criterion;
                default:
                    console.log('Unknown criteria');
                    return undefined;
            }
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
                { typeKey: 'subGrade', name: 'Sub-Grade' },
                { typeKey: 'term', name: 'Term' },
                { typeKey: 'loanPopularity', name: 'Loan Popularity' }
            ];
        }

        convertNumberToSubGrade(n) {
            return this.subGrades[n];
        }

        convertSubGradeToNumber(subGrade) {
            return this.subGrades.indexOf(subGrade);
        }

        get loansPurposes() {
            return ['Car financing',
                'Refinancing credit card at a better rate',
                'Consolidate debt',
                'Investing in learning and training',
                'Home improvement project',
                'Home down payment',
                'Major purchase',
                'Medical expenses',
                'Covering moving expenses',
                'Other',
                'Renewable energy financing',
                'Business loan',
                'Paying for dream vacation',
                'Wedding expenses'];
        }

        get homeOwnerships() {
            return ['Mortgage', 'Other', 'Own', 'Rent'];
        }

        get verifiedIncomes() {
            return ['Unverified', 'Verified'];
        }

        get states() {
            return ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];
        }

        get terms() {
            return ['36 Months', '60 Months'];
        }
    }

    angular
        .module('app')
        .service('criteriaService', criteriaService);
})();
