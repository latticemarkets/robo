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
            const tmpRule = JSON.parse(JSON.stringify(rule));
            tmpRule.criteria = tmpRule.criteria.map(criterion => {
                if (criterion.attribute === 'price' || criterion.attribute === 'premiumDiscount' || criterion.attribute == 'maxDebtIncomeWithLoan' || criterion.attribute == 'maxDebtIncome') {
                    criterion.ruleParams = criterion.ruleParams / 100;
                    criterion.highValue = criterion.highValue / 100;
                }

                switch (criterion.type) {
                    case 'slider':
                        criterion.ruleParams = `${criterion.ruleParams},${criterion.ruleParams}`;
                        criterion.ruleType = 'InRange';
                        break;
                    case 'rangeSlider':
                        criterion.ruleParams = `${criterion.ruleParams},${criterion.highValue}`;
                        criterion.ruleType = 'InRange';
                        delete criterion.highValue;
                        delete criterion.slider;
                        break;
                    case 'multi':
                        criterion.ruleParams = criterion.ruleParams.length ? criterion.ruleParams.reduce((prev, ruleParams) => `${prev},${ruleParams}`, '').substr(1) : 'Any';
                        criterion.ruleType = 'InSet';
                        break;
                    case 'text':
                        criterion.ruleParams = criterion.ruleParams.length ? criterion.ruleParams
                            .map(v => v.text)
                            .reduce((prev, ruleParams) => `${prev},${ruleParams}`, '')
                            .substr(1)
                        : 'Any';
                        criterion.ruleType = 'InSet';
                        break;
                }

                if (criterion.attribute === 'maxDebtIncomeWithLoan') {
                    criterion.ruleParams = criterion.ruleParams / 100;
                }

                delete criterion[criterion.type];
                delete criterion.type;
                delete criterion.name;
                delete criterion.value;

                return criterion;
            });
            return tmpRule;
        }

        expendCriteriaObject(rule) {
            rule.criteria = rule.criteria
                .map(criterion => this.expendCriterion(criterion))
                .filter(criterion => criterion);
            return rule;
        }

        expendCriterion(criterion) {
            let splitValue;

            switch (criterion.attribute) {
                case 'newAccounts':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 5;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 10;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams === criterion.slider.min) {
                            return `No account`;
                        }
                        else if (ruleParams === 1) {
                            return `No more than ${ruleParams} account`;
                        }
                        else if (ruleParams > 1 && ruleParams < criterion.slider.max) {
                            return `No more than ${ruleParams} accounts`;
                        }
                        else if (ruleParams === criterion.slider.max) {
                            return `No limit`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'maxDebtIncomeWithLoan':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? criterion.ruleParams * 100 : 30;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 10;
                    criterion.slider.max = 40;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams >= criterion.slider.min && ruleParams <= criterion.slider.max) {
                            return `No more than ${ruleParams}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'totalCreditLines':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 30;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 10;
                    criterion.slider.max = 40;
                    criterion.slider.step = 10;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams >= criterion.slider.min && ruleParams < criterion.slider.max) {
                            return `Up to ${ruleParams} credit lines`;
                        }
                        else if (ruleParams === criterion.slider.max) {
                            return `Any number`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'maxDelinquencies':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 3;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 6;
                    criterion.slider.step = 1;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams === 0) {
                            return `No delinquencies`;
                        }
                        if (ruleParams > criterion.slider.min && ruleParams < criterion.slider.max) {
                            return `No more than ${ruleParams} delinquencies`;
                        }
                        else if (ruleParams === criterion.slider.max) {
                            return `Any number of delinquencies`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'earliestCreditLine':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 4;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 10;
                    criterion.slider.step = 1;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams === 0) {
                            return `Any`;
                        }
                        if (ruleParams > criterion.slider.min && ruleParams <= criterion.slider.max) {
                            return `At least ${ruleParams} years`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'employmentLength':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 5;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 10;
                    criterion.slider.step = 1;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams === 0) {
                            return `Any`;
                        }
                        if (ruleParams > criterion.slider.min && ruleParams <= criterion.slider.max) {
                            return `At least ${ruleParams} years`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'inquiries':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 5;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 10;
                    criterion.slider.step = 1;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams === 0) {
                            return `No enquiry`;
                        }
                        if (ruleParams === 1) {
                            return `No more than 1 enquiry`;
                        }
                        if (ruleParams > 1 && ruleParams <= criterion.slider.max) {
                            return `No more than ${ruleParams} enquiries`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'loanPaymentIncome':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 12;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 3;
                    criterion.slider.max = 20;
                    criterion.slider.step = 1;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams >= criterion.slider.min && ruleParams <= criterion.slider.max) {
                            return `No more than ${ruleParams}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'maxDebtIncome':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? this.splitValues(criterion.ruleParams)[0] * 100 : 25;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 10;
                    criterion.slider.max = 40;
                    criterion.slider.step = 1;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams >= criterion.slider.min && ruleParams <= criterion.slider.max) {
                            return `No more than ${ruleParams}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'lastDelinquency':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 30;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 60;
                    criterion.slider.step = 1;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams === criterion.slider.min) {
                            return 'Any';
                        }
                        else if (ruleParams === 1) {
                            return `1 month and more`;
                        }
                        else if (ruleParams > 1 && ruleParams <= criterion.slider.max) {
                            return `${ruleParams} months and more`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'lastRecord':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 30;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 60;
                    criterion.slider.step = 1;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams === criterion.slider.min) {
                            return 'Any';
                        }
                        else if (ruleParams === 1) {
                            return `1 month and more`;
                        }
                        else if (ruleParams > 1 && ruleParams <= criterion.slider.max) {
                            return `${ruleParams} months and more`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'publicRecords':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 3;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 5;
                    criterion.slider.step = 1;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams === criterion.slider.min) {
                            return 'No public record';
                        }
                        else if (ruleParams === 1) {
                            return `No more than 1 public record`;
                        }
                        else if (ruleParams > 1 && ruleParams < criterion.slider.max) {
                            return `No more than ${ruleParams} public records`;
                        }
                        else if (ruleParams === criterion.slider.max) {
                            return 'Any public records';
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'revolvingUtilization':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 50;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 100;
                    criterion.slider.step = 1;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams >= criterion.slider.min && ruleParams <= criterion.slider.max) {
                            return `No more than ${ruleParams}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'expectedReturn':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 10;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 20;
                    criterion.slider.step = 1;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams >= criterion.slider.min && ruleParams <= criterion.slider.max) {
                            return `${ruleParams}% and above`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'highestExpectedReturn':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 50;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 100;
                    criterion.slider.step = 1;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams >= criterion.slider.min && ruleParams <= criterion.slider.max) {
                            return `Top ${ruleParams}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'loanPopularity':
                    criterion.type = 'slider';
                    criterion.ruleParams = criterion.ruleParams ? parseInt(this.splitValues(criterion.ruleParams)[0]) : 50;
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 100;
                    criterion.slider.step = 1;
                    criterion.slider.format = ruleParams => {
                        if (ruleParams >= criterion.slider.min && ruleParams <= criterion.slider.max) {
                            return `Top ${ruleParams}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'creditScore':
                    criterion.type = 'rangeSlider';
                    splitValue = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : [700, 800];
                    criterion.ruleParams = splitValue[0];
                    criterion.highValue = splitValue[1];
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 660;
                    criterion.slider.max = 850;
                    criterion.slider.step = 5;
                    criterion.slider.format = (ruleParams, highValue) => {
                        if (ruleParams >= criterion.slider.min && highValue <= criterion.slider.max) {
                            return `Between ${ruleParams} and ${highValue}`;
                        }
                        else if (ruleParams === highValue) {
                            return ruleParams;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'monthlyIncome':
                    criterion.type = 'rangeSlider';
                    splitValue = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : [4000, 15000];
                    criterion.ruleParams = splitValue[0];
                    criterion.highValue = splitValue[1];
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 500;
                    criterion.slider.max = 20000;
                    criterion.slider.step = 500;
                    criterion.slider.format = (ruleParams, highValue) => {
                        if (ruleParams >= criterion.slider.min && highValue < criterion.slider.max) {
                            return `From ${this.$filter('currency')(ruleParams)} to ${this.$filter('currency')(highValue)}`;
                        }
                        else if (highValue === criterion.slider.max) {
                            return `${this.$filter('currency')(ruleParams)} and up`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'openCreditLine':
                    criterion.type = 'rangeSlider';
                    splitValue = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : [4, 12];
                    criterion.ruleParams = splitValue[0];
                    criterion.highValue = splitValue[1];
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 30;
                    criterion.slider.step = 1;
                    criterion.slider.format = (ruleParams, highValue) => {
                        if (ruleParams === criterion.slider.min && highValue === criterion.slider.min) {
                            return `No line`;
                        }
                        if (ruleParams === 1 && highValue === 1) {
                            return `1 line`;
                        }
                        else if (ruleParams >= criterion.slider.min && highValue < criterion.slider.max) {
                            return `From ${ruleParams} to ${highValue} lines`;
                        }
                        else if (ruleParams === highValue) {
                            return `${ruleParams} lines`;
                        }
                        else if (highValue === criterion.slider.max) {
                            return `From ${ruleParams} to any number of lines`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'loanAmount':
                    criterion.type = 'rangeSlider';
                    splitValue = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : [4000, 10000];
                    criterion.ruleParams = splitValue[0];
                    criterion.highValue = splitValue[1];
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 1000;
                    criterion.slider.max = 35000;
                    criterion.slider.step = 1000;
                    criterion.slider.format = (ruleParams, highValue) => {
                        if (ruleParams >= criterion.slider.min && highValue <= criterion.slider.max) {
                            return `From ${this.$filter('currency')(ruleParams)} to ${this.$filter('currency')(highValue)}`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'premiumDiscount':
                    criterion.type = 'rangeSlider';
                    splitValue = criterion.ruleParams ? this.splitValues(criterion.ruleParams).map(v => v * 100) : [-12, 55];
                    criterion.ruleParams = splitValue[0];
                    criterion.highValue = splitValue[1];
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = -100;
                    criterion.slider.max = 100;
                    criterion.slider.step = 1;
                    criterion.slider.format = (ruleParams, highValue) => {
                        if (ruleParams >= criterion.slider.min && highValue <= criterion.slider.max) {
                            return `From ${ruleParams}% to ${highValue}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'remainingPayments':
                    criterion.type = 'rangeSlider';
                    splitValue = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : [4, 12];
                    criterion.ruleParams = splitValue[0];
                    criterion.highValue = splitValue[1];
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 1;
                    criterion.slider.max = 36;
                    criterion.slider.step = 1;
                    criterion.slider.format = (ruleParams, highValue) => {
                        if (ruleParams == highValue) {
                            if (ruleParams === 1) {
                                return `${highValue} month`;
                            }
                            else {
                                return `${highValue} months`;
                            }
                        }
                        else if (ruleParams >= criterion.slider.min && highValue <= criterion.slider.max) {
                            return `From ${ruleParams} to ${highValue} months`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'price':
                    criterion.type = 'rangeSlider';
                    splitValue = criterion.ruleParams ? this.splitValues(criterion.ruleParams).map(v => v * 100) : [30, 70];
                    criterion.ruleParams = splitValue[0];
                    criterion.highValue = splitValue[1];
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 100;
                    criterion.slider.step = 1;
                    criterion.slider.format = (ruleParams, highValue) => {
                        if (ruleParams >= criterion.slider.min && highValue <= criterion.slider.max) {
                            return `From ${ruleParams}% to ${highValue}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'subGrade':
                    criterion.type = 'rangeSlider';
                    splitValue = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : ['A3', 'B4'];
                    criterion.ruleParams = this.convertSubGradeToNumber(splitValue[0]);
                    criterion.highValue = this.convertSubGradeToNumber(splitValue[1]);
                    criterion.slider = {};
                    criterion.slider.name = this.getCriteriaName(criterion.attribute);
                    criterion.slider.min = 0;
                    criterion.slider.max = 34;
                    criterion.slider.step = 1;
                    criterion.slider.format = (ruleParams, highValue) => {
                        if (ruleParams === highValue) {
                            return `${this.convertNumberToSubGrade(ruleParams)} only`;
                        }
                        else if (ruleParams >= criterion.slider.min && highValue <= criterion.slider.max) {
                            return `From ${this.convertNumberToSubGrade(ruleParams)} to ${this.convertNumberToSubGrade(highValue)}`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return criterion;
                case 'loanPurpose':
                    criterion.type = 'multi';
                    criterion.ruleParams = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : this.loansPurposes;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.attribute);
                    criterion.multi.list = this.loansPurposes;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        const firsts = tmpValues.splice(0, 5);
                        return firsts.length ? `${firsts.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)} ${tmpValues.length ? `and ${tmpValues.length} others` : ''}` : 'Any';
                    };
                    return criterion;
                case 'homeOwnership':
                    criterion.type = 'multi';
                    criterion.ruleParams = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : this.homeOwnerships;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.attribute);
                    criterion.multi.list = this.homeOwnerships;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return criterion;
                case 'verifiedIncome':
                    criterion.type = 'multi';
                    criterion.ruleParams = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : this.verifiedIncomes;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.attribute);
                    criterion.multi.list = this.verifiedIncomes;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return criterion;
                case 'state':
                    criterion.type = 'multi';
                    criterion.ruleParams = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : this.states;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.attribute);
                    criterion.multi.list = this.states;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        const firsts = tmpValues.splice(0, 5);
                        return firsts.length ? `${firsts.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)} ${tmpValues.length ? `and ${tmpValues.length} others` : ''}` : 'Any';
                    };
                    return criterion;
                case 'term':
                    criterion.type = 'multi';
                    criterion.ruleParams = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : this.terms;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.attribute);
                    criterion.multi.list = this.terms;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return criterion;
                case 'loanStatus':
                    criterion.type = 'multi';
                    criterion.ruleParams = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : this.terms;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.attribute);
                    criterion.multi.list = this.loanStatus;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return criterion;
                case 'creditScoreTrend':
                    criterion.type = 'multi';
                    criterion.ruleParams = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : this.terms;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.attribute);
                    criterion.multi.list = this.creditScores;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return criterion;
                case 'recentCreditScore':
                    criterion.type = 'multi';
                    criterion.ruleParams = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : this.terms;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.attribute);
                    criterion.multi.list = this.creditScores;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return criterion;
                case 'daysPastDue':
                    criterion.type = 'multi';
                    criterion.ruleParams = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : this.terms;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.attribute);
                    criterion.multi.list = this.daysPastDues;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return criterion;
                case 'paymentNeverLate':
                    criterion.type = 'multi';
                    criterion.ruleParams = criterion.ruleParams ? this.splitValues(criterion.ruleParams) : this.terms;
                    criterion.multi = {};
                    criterion.multi.name = this.getCriteriaName(criterion.attribute);
                    criterion.multi.list = this.boolean;
                    criterion.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return criterion;
                case 'jobTitle':
                    criterion.type = 'text';
                    criterion.ruleParams = criterion.ruleParams ? this.splitValues(criterion.ruleParams).map(v => ({ text: v })) : [];
                    criterion.text = {};
                    criterion.text.name = this.getCriteriaName(criterion.attribute);
                    criterion.text.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem.text}`, '').substr(2)}` : 'Any';
                    };
                    return criterion;
                default:
                    console.log('Unknown criteria');
                    return undefined;
            }
        }

        splitValues(inRangeValue) {
            return inRangeValue.split(',');
        }

        getCriteriaName(attribute) {
            let name;
            if (this.allBaseCriteria().some(baseCriterion => {
                if (baseCriterion.attribute == attribute) {
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

        allBaseCriteria() {
            return this.baseCriteria('primary').concat(this.baseCriteria('secondary'));
        }

        baseCriteria(market) {
            switch (market) {
                case 'primary':
                    return [
                        { attribute: 'newAccounts', name: 'New Accounts (24 months)' },
                        { attribute: 'totalCreditLines', name: 'Total Credit Lines' },
                        { attribute: 'creditScore', name: 'Credit Score' },
                        { attribute: 'maxDelinquencies', name: 'Maximum Delinquencies' },
                        { attribute: 'earliestCreditLine', name: 'Earliest Credit Line' },
                        { attribute: 'employmentLength', name: 'Employment Length' },
                        { attribute: 'jobTitle', name: 'Job Title' },
                        { attribute: 'homeOwnership', name: 'Home Ownership' },
                        { attribute: 'inquiries', name: 'Inquiries' },
                        { attribute: 'loanPaymentIncome', name: 'Loan Payment Income' },
                        { attribute: 'verifiedIncome', name: 'Verified Income' },
                        { attribute: 'loanAmount', name: 'Loan Amount' },
                        { attribute: 'maxDebtIncome', name: 'Max Debt / Income' },
                        { attribute: 'maxDebtIncomeWithLoan', name: 'Max Debt / Income with Loan' },
                        { attribute: 'monthlyIncome', name: 'Monthly Income' },
                        { attribute: 'lastDelinquency', name: 'Last Delinquency' },
                        { attribute: 'lastRecord', name: 'Last Record' },
                        { attribute: 'openCreditLine', name: 'Open Credit Line' },
                        { attribute: 'publicRecords', name: 'Public Records' },
                        { attribute: 'loanPurpose', name: 'Loan Purpose' },
                        { attribute: 'revolvingUtilization', name: 'Revolving Utilization' },
                        { attribute: 'expectedReturn', name: 'Expected Return' },
                        { attribute: 'highestExpectedReturn', name: 'Highest Expected Return' },
                        { attribute: 'state', name: 'State' },
                        { attribute: 'subGrade', name: 'Sub-Grade' },
                        { attribute: 'term', name: 'Term' },
                        { attribute: 'loanPopularity', name: 'Loan Popularity' }
                    ];
                case 'secondary':
                    return [
                        { attribute: 'loanStatus', name: 'Loan Status' },
                        { attribute: 'creditScoreTrend', name: 'Credit Score Trend' },
                        { attribute: 'premiumDiscount', name: 'Premium / Discount' },
                        { attribute: 'recentCreditScore', name: 'Recent Credit Score' },
                        { attribute: 'daysPastDue', name: 'Days Past Due' },
                        { attribute: 'paymentNeverLate', name: 'Payment Never Late' },
                        { attribute: 'price', name: 'Price' },
                        { attribute: 'remainingPayments', name: 'Remaining Payments' },
                        { attribute: 'subGrade', name: 'Sub-Grade' },
                        { attribute: 'term', name: 'Term' }/*,
                        { attribute: 'yieldToMaturity', name: 'Yield To Maturity' }*/
                    ];
                default:
                    return undefined;
            }
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

        get loanStatus() {
            return ['Currently Paying', 'Default', 'In Grace Period', 'Late (16 - 30 days)', 'Late (31 - 120 days)'];
        }

        get creditScores() {
            return ['Up', 'Unchanged', 'Down'];
        }

        get daysPastDues() {
            return ['5', '15', '30', '60', '90'];
        }

        get boolean() {
            return ['Yes', 'No'];
        }

        initializeRule(originator) {
            return {
                id: this.generateUUID(),
                name: 'New Rule',
                originator: originator,
                expectedReturn: {
                    value: 0,
                    percent: 0.3,
                    margin: 0
                },
                loansAvailablePerWeek: 0,
                moneyAvailablePerWeek: 0,
                criteria: [],
                isEnabled: true,
                minNoteAmount: 25,
                maxNoteAmount: 25,
                maximumDailyInvestment: 250
            };
        }

        generateUUID() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        }
    }

    angular
        .module('app')
        .service('criteriaService', criteriaService);
})();
