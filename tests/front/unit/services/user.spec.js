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
        _userService,
        _$window;

    beforeEach(() => {
        module('app');
    });

    beforeEach(() => {
        module($provide => {
            $provide.service('$window', () => {
                return {
                    location: { href: '' }
                };
            });
        });
    });

    beforeEach(inject((userService, $httpBackend, $window) => {
        _userService = userService;
        _$httpBackend = $httpBackend;
        _$window = $window;
    }));

    describe('register', () => {
        let email,
            password,
            terms,
            reason,
            income,
            timeline,
            birthday,
            platforms,
            firstName,
            lastName,
            portfolio;

        beforeEach(() => {
            email = 'email';
            password = 'password';
            terms = 'terms';
            reason = 'reason';
            income = 'income';
            timeline = 'timeline';
            birthday = 'birthday';
            platforms = 'platforms';
            firstName = 'firstName';
            lastName = 'lastName';

            _$httpBackend.when('POST', '/api/register').respond();

            _userService.register(email, password, terms, reason, income, timeline, birthday, platforms, firstName, lastName);
        });

        it('should call the API', () => {
            _$httpBackend.expectPOST('/api/register', {
                "email": "email",
                "password": "password",
                "terms": "terms",
                "reason": "reason",
                "income": "income",
                "timeline": "timeline",
                "birthday": "birthday",
                "platforms": "platforms",
                "firstName": "firstname",
                "lastName": "lastname"
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

            _$httpBackend.when('GET', `/api/user/check/${email}`).respond();

            _userService.isEmailUsed(email);
        });

        it('should call the API', () => {
            _$httpBackend.expectGET(`/api/user/check/${email}`);
            expect(_$httpBackend.flush).not.toThrow();
        });

        afterEach(() => {
            _$httpBackend.verifyNoOutstandingExpectation();
            _$httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('userInformations', () => {
        let email;

        beforeEach(() => {
            email = "email";

            _$httpBackend.when('GET', `/api/user/infos/${email}`).respond();
            _userService.userData(email);
        });

        it('should call the API', () => {
            _$httpBackend.expectGET(`/api/user/infos/${email}`);
            expect(_$httpBackend.flush).not.toThrow();
        });

        afterEach(() => {
            _$httpBackend.verifyNoOutstandingExpectation();
            _$httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('userData', () => {
        let email;

        beforeEach(() => {
            email = "email@domain.co.uk";

            _$httpBackend.when('GET', '/api/user/infos/email@domain.co.uk').respond();

            _userService.userData(email);
        });

        it('should call the API', () => {
            _$httpBackend.expectGET('/api/user/infos/email@domain.co.uk');
            expect(_$httpBackend.flush).not.toThrow();
        });

        afterEach(() => {
            _$httpBackend.verifyNoOutstandingExpectation();
            _$httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('updatePassword', () => {
        let email,
            oldPassword,
            newPassword;

        beforeEach(() => {
            email = 'toto@tata.co.uk';
            oldPassword = '0ldPassword';
            newPassword = "NewPassw0rd";

            _$httpBackend.when('PUT', '/api/user/password').respond();

            _userService.updatePassword(email, oldPassword, newPassword);
        });

        it('should should call the API', () => {
            _$httpBackend.expectPUT('/api/user/password', { email: email, oldPassword: oldPassword, newPassword: newPassword });
            expect(_$httpBackend.flush).not.toThrow();
        });

        afterEach(() => {
            _$httpBackend.verifyNoOutstandingExpectation();
            _$httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('updatePersonalData', () => {
        let email,
            firstName,
            lastName,
            birthday;

        beforeEach(() => {
            email = 'toto@tata.co.uk';
            firstName = 'firstName';
            lastName = 'lastName';
            birthday = 'birthday';

            _$httpBackend.when('PUT', '/api/user/personalData').respond();

            _userService.updatePersonalData(email, firstName, lastName, birthday);
        });

        it('should should call the API', () => {
            _$httpBackend.expectPUT('/api/user/personalData', { email: email, firstName: 'firstname', lastName: 'lastname', birthday: birthday });
            expect(_$httpBackend.flush).not.toThrow();
        });

        afterEach(() => {
            _$httpBackend.verifyNoOutstandingExpectation();
            _$httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('destroyUser', () => {
        let email,
            password;

        beforeEach(() => {
            email = 'toto@tata.co.uk';
            password = 'passW0rd';

            _$httpBackend.when('POST', '/api/user/destroy').respond();

            _userService.destroyUser(email, password);
        });

        it('should should call the API', () => {
            _$httpBackend.expectPOST('/api/user/destroy', { email: email, password: password });
            expect(_$httpBackend.flush).not.toThrow();
        });

        afterEach(() => {
            _$httpBackend.verifyNoOutstandingExpectation();
            _$httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('checkUserToken', () => {
        let email,
            token,
            callback;

        beforeEach(() => {
            email = 'toto@tata.fr';
            token = 'myToken';
            callback = jasmine.createSpy('callback');
        });

        describe('on success', () => {
            beforeEach(() => {
                _$httpBackend.when('POST', '/api/user/token').respond(200);
                _userService.checkUserToken(email, token, callback);
            });

            it('should call success callback', () => {
                _$httpBackend.expectPOST('/api/user/token', { email: email, token: token });
                _$httpBackend.flush();
                expect(callback).toHaveBeenCalled();
            });

            it('should not redirect the user', () => {
                _$httpBackend.expectPOST('/api/user/token', { email: email, token: token });
                _$httpBackend.flush();
                expect(_$window.location.href).toBe('');
            });
        });

        describe('on error', () => {
            beforeEach(() => {
                _$httpBackend.when('POST', '/api/user/token').respond(401);
                _userService.checkUserToken(email, token, callback);
            });

            it('should redirect the user to the landpage', () => {
                _$httpBackend.expectPOST('/api/user/token', { email: email, token: token });
                _$httpBackend.flush();
                expect(_$window.location.href).toBe('/');
            });
        });

        afterEach(() => {
            _$httpBackend.verifyNoOutstandingExpectation();
            _$httpBackend.verifyNoOutstandingRequest();
        });
    });
});