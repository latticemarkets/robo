/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 29/01/2016
*/

describe('userService', () => {
    let _$httpBackend,
        _userService;

    beforeEach(() => {
        module('app');
    });

    beforeEach(inject((userService, $httpBackend) => {
        _userService = userService;
        _$httpBackend = $httpBackend;

    }));

    describe('register', () => {
        let email,
            password,
            terms,
            reason,
            income,
            timeline,
            birthday,
            platform,
            accountId,
            firstName,
            lastName,
            apiKey;

        beforeEach(() => {
            email = 'email';
            password = 'password';
            terms = 'terms';
            reason = 'reason';
            income = 'income';
            timeline = 'timeline';
            birthday = 'birthday';
            platform = 'platform';
            accountId = 'accountId';
            firstName = 'firstName';
            lastName = 'lastName';
            apiKey = 'apiKey';

            _$httpBackend.when('POST', '/api/register').respond();

            _userService.register(email, password, terms, reason, income, timeline, birthday, platform, accountId, firstName, lastName, apiKey);
        });

        it('should call the API', () => {
            _$httpBackend.expectPOST('/api/register', {
                _id: email,
                password: password,
                terms: terms,
                reason: reason,
                income: income,
                timeline: timeline,
                birthday: birthday,
                platform: platform,
                accountId: accountId,
                firstName: firstName,
                lastName: lastName,
                apiKey: apiKey
            });
            expect(_$httpBackend.flush).not.toThrow();
        });

        afterEach(() => {
            _$httpBackend.verifyNoOutstandingExpectation();
            _$httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('login', () => {
        let email,
            password;

        beforeEach(() => {
            email = "email";
            password = "password";

            _$httpBackend.when('POST', '/api/login').respond();

            _userService.login(email, password);
        });

        it('should call the API', () => {
            _$httpBackend.expectPOST('/api/login', { email: email, password: password });
            expect(_$httpBackend.flush).not.toThrow();
        });

        afterEach(() => {
            _$httpBackend.verifyNoOutstandingExpectation();
            _$httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('isEmailUsed', () => {
        let email;

        beforeEach(() => {
            email = "email";

            _$httpBackend.when('GET', `/api/user/${email}`).respond();

            _userService.isEmailUsed(email);
        });

        it('should call the API', () => {
            _$httpBackend.expectGET(`/api/user/${email}`);
            expect(_$httpBackend.flush).not.toThrow();
        });

        afterEach(() => {
            _$httpBackend.verifyNoOutstandingExpectation();
            _$httpBackend.verifyNoOutstandingRequest();
        });
    });
});