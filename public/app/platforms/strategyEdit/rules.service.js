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

    class rulesService {
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

        unexpendStrategyObject(strategy) {
            const tmpStrategy = JSON.parse(JSON.stringify(strategy));
            tmpStrategy.rules = tmpStrategy.rules.map(rule => {
                if (rule.attribute === 'price' || rule.attribute === 'premiumDiscount') {
                    rule.ruleParams = rule.ruleParams / 100;
                    rule.highValue = rule.highValue / 100;
                }

                if (rule.attribute == 'maxDebtIncome' || rule.attribute == 'maxDebtIncomeWithLoan') {
                    rule.ruleParams = rule.ruleParams / 100;
                }

                switch (rule.type) {
                    case 'slider':
                        rule.ruleParams = `${rule.ruleParams},${rule.ruleParams}`;
                        rule.ruleType = 'InRange';
                        break;
                    case 'rangeSlider':
                        rule.ruleParams = `${rule.ruleParams},${rule.highValue}`;
                        rule.ruleType = 'InRange';
                        delete rule.highValue;
                        delete rule.slider;
                        break;
                    case 'multi':
                        rule.ruleParams = rule.ruleParams.length ? rule.ruleParams.reduce((prev, ruleParams) => `${prev},${ruleParams}`, '').substr(1) : 'Any';
                        rule.ruleType = 'InSet';
                        break;
                    case 'text':
                        rule.ruleParams = rule.ruleParams.length ? rule.ruleParams
                            .map(v => v.text)
                            .reduce((prev, ruleParams) => `${prev},${ruleParams}`, '')
                            .substr(1)
                        : 'Any';
                        rule.ruleType = 'InSet';
                        break;
                }

                delete rule[rule.type];
                delete rule.type;
                delete rule.name;
                delete rule.value;

                return rule;
            });
            return tmpStrategy;
        }

        expendStrategyObject(strategy) {
            strategy.rules = strategy.rules
                .map(rule => this.expendRule(rule))
                .filter(rule => rule);
            return strategy;
        }

        expendRule(rule) {
            let splitValue;

            switch (rule.attribute) {
                case 'newAccounts':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 5;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 10;
                    rule.slider.format = ruleParams => {
                        if (ruleParams === rule.slider.min) {
                            return `No account`;
                        }
                        else if (ruleParams === 1) {
                            return `No more than ${ruleParams} account`;
                        }
                        else if (ruleParams > 1 && ruleParams < rule.slider.max) {
                            return `No more than ${ruleParams} accounts`;
                        }
                        else if (ruleParams === rule.slider.max) {
                            return `No limit`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'totalCreditLines':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 30;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 10;
                    rule.slider.max = 40;
                    rule.slider.step = 10;
                    rule.slider.format = ruleParams => {
                        if (ruleParams >= rule.slider.min && ruleParams < rule.slider.max) {
                            return `Up to ${ruleParams} credit lines`;
                        }
                        else if (ruleParams === rule.slider.max) {
                            return `Any number`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'maxDelinquencies':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 3;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 6;
                    rule.slider.step = 1;
                    rule.slider.format = ruleParams => {
                        if (ruleParams === 0) {
                            return `No delinquencies`;
                        }
                        if (ruleParams > rule.slider.min && ruleParams < rule.slider.max) {
                            return `No more than ${ruleParams} delinquencies`;
                        }
                        else if (ruleParams === rule.slider.max) {
                            return `Any number of delinquencies`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'earliestCreditLine':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 4;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 10;
                    rule.slider.step = 1;
                    rule.slider.format = ruleParams => {
                        if (ruleParams === 0) {
                            return `Any`;
                        }
                        if (ruleParams > rule.slider.min && ruleParams <= rule.slider.max) {
                            return `At least ${ruleParams} years`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'employmentLength':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 5;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 10;
                    rule.slider.step = 1;
                    rule.slider.format = ruleParams => {
                        if (ruleParams === 0) {
                            return `Any`;
                        }
                        if (ruleParams > rule.slider.min && ruleParams <= rule.slider.max) {
                            return `At least ${ruleParams} years`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'inquiries':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 5;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 10;
                    rule.slider.step = 1;
                    rule.slider.format = ruleParams => {
                        if (ruleParams === 0) {
                            return `No enquiry`;
                        }
                        if (ruleParams === 1) {
                            return `No more than 1 enquiry`;
                        }
                        if (ruleParams > 1 && ruleParams <= rule.slider.max) {
                            return `No more than ${ruleParams} enquiries`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'loanPaymentIncome':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 12;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 3;
                    rule.slider.max = 20;
                    rule.slider.step = 1;
                    rule.slider.format = ruleParams => {
                        if (ruleParams >= rule.slider.min && ruleParams <= rule.slider.max) {
                            return `No more than ${ruleParams}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'maxDebtIncome':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? this.splitValues(rule.ruleParams)[0] * 100 : 25;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 10;
                    rule.slider.max = 40;
                    rule.slider.step = 1;
                    rule.slider.format = ruleParams => {
                        if (ruleParams >= rule.slider.min && ruleParams <= rule.slider.max) {
                            return `No more than ${ruleParams}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'maxDebtIncomeWithLoan':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? this.splitValues(rule.ruleParams)[0] * 100 : 30;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 10;
                    rule.slider.max = 40;
                    rule.slider.format = ruleParams => {
                        if (ruleParams >= rule.slider.min && ruleParams <= rule.slider.max) {
                            return `No more than ${ruleParams}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'lastDelinquency':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 30;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 60;
                    rule.slider.step = 1;
                    rule.slider.format = ruleParams => {
                        if (ruleParams === rule.slider.min) {
                            return 'Any';
                        }
                        else if (ruleParams === 1) {
                            return `1 month and more`;
                        }
                        else if (ruleParams > 1 && ruleParams <= rule.slider.max) {
                            return `${ruleParams} months and more`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'lastRecord':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 30;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 60;
                    rule.slider.step = 1;
                    rule.slider.format = ruleParams => {
                        if (ruleParams === rule.slider.min) {
                            return 'Any';
                        }
                        else if (ruleParams === 1) {
                            return `1 month and more`;
                        }
                        else if (ruleParams > 1 && ruleParams <= rule.slider.max) {
                            return `${ruleParams} months and more`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'publicRecords':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 3;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 5;
                    rule.slider.step = 1;
                    rule.slider.format = ruleParams => {
                        if (ruleParams === rule.slider.min) {
                            return 'No public record';
                        }
                        else if (ruleParams === 1) {
                            return `No more than 1 public record`;
                        }
                        else if (ruleParams > 1 && ruleParams < rule.slider.max) {
                            return `No more than ${ruleParams} public records`;
                        }
                        else if (ruleParams === rule.slider.max) {
                            return 'Any public records';
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'revolvingUtilization':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 50;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 100;
                    rule.slider.step = 1;
                    rule.slider.format = ruleParams => {
                        if (ruleParams >= rule.slider.min && ruleParams <= rule.slider.max) {
                            return `No more than ${ruleParams}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'expectedReturn':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 10;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 20;
                    rule.slider.step = 1;
                    rule.slider.format = ruleParams => {
                        if (ruleParams >= rule.slider.min && ruleParams <= rule.slider.max) {
                            return `${ruleParams}% and above`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'highestExpectedReturn':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 50;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 100;
                    rule.slider.step = 1;
                    rule.slider.format = ruleParams => {
                        if (ruleParams >= rule.slider.min && ruleParams <= rule.slider.max) {
                            return `Top ${ruleParams}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'loanPopularity':
                    rule.type = 'slider';
                    rule.ruleParams = rule.ruleParams ? parseInt(this.splitValues(rule.ruleParams)[0]) : 50;
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 100;
                    rule.slider.step = 1;
                    rule.slider.format = ruleParams => {
                        if (ruleParams >= rule.slider.min && ruleParams <= rule.slider.max) {
                            return `Top ${ruleParams}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'creditScore':
                    rule.type = 'rangeSlider';
                    splitValue = rule.ruleParams ? this.splitValues(rule.ruleParams) : [700, 800];
                    rule.ruleParams = splitValue[0];
                    rule.highValue = splitValue[1];
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 660;
                    rule.slider.max = 850;
                    rule.slider.step = 5;
                    rule.slider.format = (ruleParams, highValue) => {
                        if (ruleParams >= rule.slider.min && highValue <= rule.slider.max) {
                            return `Between ${ruleParams} and ${highValue}`;
                        }
                        else if (ruleParams === highValue) {
                            return ruleParams;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'monthlyIncome':
                    rule.type = 'rangeSlider';
                    splitValue = rule.ruleParams ? this.splitValues(rule.ruleParams) : [4000, 15000];
                    rule.ruleParams = splitValue[0];
                    rule.highValue = splitValue[1];
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 500;
                    rule.slider.max = 20000;
                    rule.slider.step = 500;
                    rule.slider.format = (ruleParams, highValue) => {
                        if (ruleParams >= rule.slider.min && highValue < rule.slider.max) {
                            return `From ${this.$filter('currency')(ruleParams)} to ${this.$filter('currency')(highValue)}`;
                        }
                        else if (highValue === rule.slider.max) {
                            return `${this.$filter('currency')(ruleParams)} and up`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'openCreditLine':
                    rule.type = 'rangeSlider';
                    splitValue = rule.ruleParams ? this.splitValues(rule.ruleParams) : [4, 12];
                    rule.ruleParams = splitValue[0];
                    rule.highValue = splitValue[1];
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 30;
                    rule.slider.step = 1;
                    rule.slider.format = (ruleParams, highValue) => {
                        if (ruleParams === rule.slider.min && highValue === rule.slider.min) {
                            return `No line`;
                        }
                        if (ruleParams === 1 && highValue === 1) {
                            return `1 line`;
                        }
                        else if (ruleParams >= rule.slider.min && highValue < rule.slider.max) {
                            return `From ${ruleParams} to ${highValue} lines`;
                        }
                        else if (ruleParams === highValue) {
                            return `${ruleParams} lines`;
                        }
                        else if (highValue === rule.slider.max) {
                            return `From ${ruleParams} to any number of lines`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'loanAmount':
                    rule.type = 'rangeSlider';
                    splitValue = rule.ruleParams ? this.splitValues(rule.ruleParams) : [4000, 10000];
                    rule.ruleParams = splitValue[0];
                    rule.highValue = splitValue[1];
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 1000;
                    rule.slider.max = 35000;
                    rule.slider.step = 1000;
                    rule.slider.format = (ruleParams, highValue) => {
                        if (ruleParams >= rule.slider.min && highValue <= rule.slider.max) {
                            return `From ${this.$filter('currency')(ruleParams)} to ${this.$filter('currency')(highValue)}`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'premiumDiscount':
                    rule.type = 'rangeSlider';
                    splitValue = rule.ruleParams ? this.splitValues(rule.ruleParams).map(v => v * 100) : [-12, 55];
                    rule.ruleParams = splitValue[0];
                    rule.highValue = splitValue[1];
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = -100;
                    rule.slider.max = 100;
                    rule.slider.step = 1;
                    rule.slider.format = (ruleParams, highValue) => {
                        if (ruleParams >= rule.slider.min && highValue <= rule.slider.max) {
                            return `From ${ruleParams}% to ${highValue}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'remainingPayments':
                    rule.type = 'rangeSlider';
                    splitValue = rule.ruleParams ? this.splitValues(rule.ruleParams) : [4, 12];
                    rule.ruleParams = splitValue[0];
                    rule.highValue = splitValue[1];
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 1;
                    rule.slider.max = 36;
                    rule.slider.step = 1;
                    rule.slider.format = (ruleParams, highValue) => {
                        if (ruleParams == highValue) {
                            if (ruleParams === 1) {
                                return `${highValue} month`;
                            }
                            else {
                                return `${highValue} months`;
                            }
                        }
                        else if (ruleParams >= rule.slider.min && highValue <= rule.slider.max) {
                            return `From ${ruleParams} to ${highValue} months`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'price':
                    rule.type = 'rangeSlider';
                    splitValue = rule.ruleParams ? this.splitValues(rule.ruleParams).map(v => v * 100) : [30, 70];
                    rule.ruleParams = splitValue[0];
                    rule.highValue = splitValue[1];
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 100;
                    rule.slider.step = 1;
                    rule.slider.format = (ruleParams, highValue) => {
                        if (ruleParams >= rule.slider.min && highValue <= rule.slider.max) {
                            return `From ${ruleParams}% to ${highValue}%`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'subGrade':
                    rule.type = 'rangeSlider';
                    splitValue = rule.ruleParams ? this.splitValues(rule.ruleParams) : ['A3', 'B4'];
                    rule.ruleParams = this.convertSubGradeToNumber(splitValue[0]);
                    rule.highValue = this.convertSubGradeToNumber(splitValue[1]);
                    rule.slider = {};
                    rule.slider.name = this.getCriteriaName(rule.attribute);
                    rule.slider.min = 0;
                    rule.slider.max = 34;
                    rule.slider.step = 1;
                    rule.slider.format = (ruleParams, highValue) => {
                        if (ruleParams === highValue) {
                            return `${this.convertNumberToSubGrade(ruleParams)} only`;
                        }
                        else if (ruleParams >= rule.slider.min && highValue <= rule.slider.max) {
                            return `From ${this.convertNumberToSubGrade(ruleParams)} to ${this.convertNumberToSubGrade(highValue)}`;
                        }
                        else {
                            return `Error`;
                        }
                    };
                    return rule;
                case 'loanPurpose':
                    rule.type = 'multi';
                    rule.ruleParams = rule.ruleParams ? this.splitValues(rule.ruleParams) : this.loansPurposes;
                    rule.multi = {};
                    rule.multi.name = this.getCriteriaName(rule.attribute);
                    rule.multi.list = this.loansPurposes;
                    rule.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        const firsts = tmpValues.splice(0, 5);
                        return firsts.length ? `${firsts.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)} ${tmpValues.length ? `and ${tmpValues.length} others` : ''}` : 'Any';
                    };
                    return rule;
                case 'homeOwnership':
                    rule.type = 'multi';
                    rule.ruleParams = rule.ruleParams ? this.splitValues(rule.ruleParams) : this.homeOwnerships;
                    rule.multi = {};
                    rule.multi.name = this.getCriteriaName(rule.attribute);
                    rule.multi.list = this.homeOwnerships;
                    rule.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return rule;
                case 'verifiedIncome':
                    rule.type = 'multi';
                    rule.ruleParams = rule.ruleParams ? this.splitValues(rule.ruleParams) : this.verifiedIncomes;
                    rule.multi = {};
                    rule.multi.name = this.getCriteriaName(rule.attribute);
                    rule.multi.list = this.verifiedIncomes;
                    rule.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return rule;
                case 'state':
                    rule.type = 'multi';
                    rule.ruleParams = rule.ruleParams ? this.splitValues(rule.ruleParams) : this.states;
                    rule.multi = {};
                    rule.multi.name = this.getCriteriaName(rule.attribute);
                    rule.multi.list = this.states;
                    rule.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        const firsts = tmpValues.splice(0, 5);
                        return firsts.length ? `${firsts.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)} ${tmpValues.length ? `and ${tmpValues.length} others` : ''}` : 'Any';
                    };
                    return rule;
                case 'term':
                    rule.type = 'multi';
                    rule.ruleParams = rule.ruleParams ? this.splitValues(rule.ruleParams) : this.terms;
                    rule.multi = {};
                    rule.multi.name = this.getCriteriaName(rule.attribute);
                    rule.multi.list = this.terms;
                    rule.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return rule;
                case 'loanStatus':
                    rule.type = 'multi';
                    rule.ruleParams = rule.ruleParams ? this.splitValues(rule.ruleParams) : this.terms;
                    rule.multi = {};
                    rule.multi.name = this.getCriteriaName(rule.attribute);
                    rule.multi.list = this.loanStatus;
                    rule.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return rule;
                case 'creditScoreTrend':
                    rule.type = 'multi';
                    rule.ruleParams = rule.ruleParams ? this.splitValues(rule.ruleParams) : this.terms;
                    rule.multi = {};
                    rule.multi.name = this.getCriteriaName(rule.attribute);
                    rule.multi.list = this.creditScores;
                    rule.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return rule;
                case 'recentCreditScore':
                    rule.type = 'multi';
                    rule.ruleParams = rule.ruleParams ? this.splitValues(rule.ruleParams) : this.terms;
                    rule.multi = {};
                    rule.multi.name = this.getCriteriaName(rule.attribute);
                    rule.multi.list = this.creditScores;
                    rule.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return rule;
                case 'daysPastDue':
                    rule.type = 'multi';
                    rule.ruleParams = rule.ruleParams ? this.splitValues(rule.ruleParams) : this.terms;
                    rule.multi = {};
                    rule.multi.name = this.getCriteriaName(rule.attribute);
                    rule.multi.list = this.daysPastDues;
                    rule.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return rule;
                case 'paymentNeverLate':
                    rule.type = 'multi';
                    rule.ruleParams = rule.ruleParams ? this.splitValues(rule.ruleParams) : this.terms;
                    rule.multi = {};
                    rule.multi.name = this.getCriteriaName(rule.attribute);
                    rule.multi.list = this.boolean;
                    rule.multi.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem}`, '').substr(2)}` : 'Any';
                    };
                    return rule;
                case 'jobTitle':
                    rule.type = 'text';
                    rule.ruleParams = rule.ruleParams ? this.splitValues(rule.ruleParams).map(v => ({ text: v })) : [];
                    rule.text = {};
                    rule.text.name = this.getCriteriaName(rule.attribute);
                    rule.text.format = (values) => {
                        let tmpValues = JSON.parse(JSON.stringify(values));
                        return tmpValues.length ? `${tmpValues.reduce((prev, elem) => `${prev}, ${elem.text}`, '').substr(2)}` : 'Any';
                    };
                    return rule;
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

        initializeStrategy(originator) {
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
                rules: [],
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
        .service('rulesService', rulesService);
})();
