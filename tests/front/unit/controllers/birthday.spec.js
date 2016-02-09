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

describe('SignupBirthdayController', () => {
    let birthdayController,
        $cookieStore,
        $location;

    beforeEach(() => {
        module('app');

        $cookieStore = jasmine.createSpyObj('$cookieStore', ['get', 'put']);
        $location = jasmine.createSpyObj('$location', ['path']);
    });

    beforeEach(inject(($controller) => {
        birthdayController = $controller('SignupBirthdayController', {
            $cookieStore : $cookieStore,
            $location : $location
        });
    }));

    describe('initialization', () => {
        describe('data are present', () => {
            beforeEach(() => {
                $cookieStore.get.and.callFake(() => jasmine.any(String));
            });

            it('should get previous data', () => {
                expect($cookieStore.get).toHaveBeenCalledWith('signup.email');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.password');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.terms');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.reason');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.income');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.timeline');
            });
        });

        describe('data are NOT present', () => {
            beforeEach(() => {
                $cookieStore.get.and.callFake(() => undefined);
            });

            it('go back to first registration page', () => {
                expect($cookieStore.get).toHaveBeenCalledWith('signup.email');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.password');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.terms');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.reason');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.income');
                expect($cookieStore.get).toHaveBeenCalledWith('signup.timeline');
                expect($location.path).toHaveBeenCalledWith('/signup');
            });
        });
    });

    describe('disableSubmitButton', () => {
        describe('bad month', () => {
            beforeEach(() => {
                birthdayController.day = "01";
                birthdayController.year = "1992";
            });

            it('should fail on empty field', () => {
                birthdayController.month = "";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should fail on not numeric', () => {
                birthdayController.month = "fsg";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should fail on negative value', () => {
                birthdayController.month = "-1";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should fail on value > 12', () => {
                birthdayController.month = "13";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should fail on 0', () => {
                birthdayController.month = "0";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should pass', () => {
                birthdayController.month = "1";
                expect(birthdayController.disableSubmitButton()).toBeFalsy();
            });
        });

        describe('bad day', () => {
            beforeEach(() => {
                birthdayController.month = "01";
                birthdayController.year = "1992";
            });

            it('should fail on empty field', () => {
                birthdayController.day = "";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should fail on not numeric', () => {
                birthdayController.day = "fdsgf";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should fail on negative value', () => {
                birthdayController.day = "-1";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should fail on value > 31', () => {
                birthdayController.day = "32";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should fail on 0', () => {
                birthdayController.day = "0";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should pass', () => {
                birthdayController.day = "1";
                expect(birthdayController.disableSubmitButton()).toBeFalsy();
            });
        });

        describe('bad year', () => {
            beforeEach(() => {
                birthdayController.month = "01";
                birthdayController.day = "01";
            });

            it('should fail on not numeric', () => {
                birthdayController.year = "fdsg";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should fail on empty field', () => {
                birthdayController.year = "";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should fail on negative value', () => {
                birthdayController.year = "-1";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should fail on value > (currentYear - 18)', () => {
                birthdayController.year = String(new Date().getFullYear() - 17);
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should fail on value < 1900', () => {
                birthdayController.year = "1899";
                expect(birthdayController.disableSubmitButton()).toBeTruthy();
            });

            it('should pass', () => {
                birthdayController.year = "1992";
                expect(birthdayController.disableSubmitButton()).toBeFalsy();
            });
        });
    });

    describe('submit', () => {
        describe('bad values', () => {
            function checkNotCalled() {
                birthdayController.submit();
                expect($cookieStore.put).not.toHaveBeenCalled();
                expect($location.path).not.toHaveBeenCalledWith('/signup/p2pPlatform');
            }

            describe('bad month', () => {
                beforeEach(() => {
                    birthdayController.day = "01";
                    birthdayController.year = "1992";
                });

                it('should fail on empty field', () => {
                    birthdayController.month = "";
                    checkNotCalled();
                });

                it('should fail on not numeric', () => {
                    birthdayController.month = "fsdg";
                   checkNotCalled();
                });

                it('should fail on negative value', () => {
                    birthdayController.month = "-1";
                   checkNotCalled();
                });

                it('should fail on value > 12', () => {
                    birthdayController.month = "13";
                   checkNotCalled();
                });

                it('should fail on 0', () => {
                    birthdayController.month = "0";
                   checkNotCalled();
                });
            });

            describe('bad day', () => {
                beforeEach(() => {
                    birthdayController.month = "01";
                    birthdayController.year = "1992";
                });

                it('should fail on empty field', () => {
                    birthdayController.day = "";
                   checkNotCalled();
                });

                it('should fail on not numeric', () => {
                    birthdayController.day = "dgfs";
                   checkNotCalled();
                });

                it('should fail on negative value', () => {
                    birthdayController.day = "-1";
                   checkNotCalled();
                });

                it('should fail on value > 31', () => {
                    birthdayController.day = "32";
                   checkNotCalled();
                });

                it('should fail on 0', () => {
                    birthdayController.day = "0";
                   checkNotCalled();
                });
            });

            describe('bad year', () => {
                beforeEach(() => {
                    birthdayController.month = "01";
                    birthdayController.day = "01";
                });

                it('should fail on empty field', () => {
                    birthdayController.year = "";
                   checkNotCalled();
                });

                it('should fail on not numeric', () => {
                    birthdayController.year = "dsf";
                   checkNotCalled();
                });

                it('should fail on negative value', () => {
                    birthdayController.year = "-1";
                   checkNotCalled();
                });

                it('should fail on value > (currentYear - 18)', () => {
                    birthdayController.year = String(new Date().getFullYear() - 17);
                   checkNotCalled();
                });

                it('should fail on value < 1900', () => {
                    birthdayController.year = "1899";
                   checkNotCalled();
                });
            });
        });

        describe('good values', () => {
            beforeEach(() => {
                birthdayController.month = "5";
                birthdayController.day = "11";
                birthdayController.year = "1992";
                birthdayController.submit();
            });

            it('should add the birthdate in a cookie', () => {
                expect($cookieStore.put).toHaveBeenCalledWith('signup.birthday', '5/11/1992');
            });

            it('should go to P2P platform page', () => {
                expect($location.path).toHaveBeenCalledWith('/signup/portfolio');
            });
        });
    });
});