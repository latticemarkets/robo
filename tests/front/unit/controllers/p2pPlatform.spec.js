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

describe('SignupP2pPlatformController', () => {
    let p2pPlatformController,
        $cookies,
        $location;

    beforeEach(() => {
        module('app');

        $cookies = jasmine.createSpyObj('$cookies', ['get', 'put', 'putObject', 'getObject']);
        $location = jasmine.createSpyObj('$location', ['path']);
    });

    describe('initialization', () => {
        beforeEach(inject(($controller) => {
            p2pPlatformController = $controller('SignupP2pPlatformController', {
                $cookies : $cookies,
                $location : $location
            });
        }));

        describe('data are present', () => {
            beforeEach(() => {
                $cookies.get.and.callFake(() => jasmine.any(String));
            });

            it('should get previous data', () => {
                expect($cookies.get).toHaveBeenCalledWith('signup.email');
                expect($cookies.get).toHaveBeenCalledWith('signup.password');
                expect($cookies.get).toHaveBeenCalledWith('signup.terms');
                expect($cookies.get).toHaveBeenCalledWith('signup.reason');
                expect($cookies.get).toHaveBeenCalledWith('signup.income');
                expect($cookies.get).toHaveBeenCalledWith('signup.timeline');
                expect($cookies.get).toHaveBeenCalledWith('signup.birthday');
            });
        });

        describe('data are NOT present', () => {
            beforeEach(() => {
                $cookies.get.and.callFake(() => undefined);
            });

            it('go back to first registration page', () => {
                expect($cookies.get).toHaveBeenCalledWith('signup.email');
                expect($cookies.get).toHaveBeenCalledWith('signup.password');
                expect($cookies.get).toHaveBeenCalledWith('signup.terms');
                expect($cookies.get).toHaveBeenCalledWith('signup.reason');
                expect($cookies.get).toHaveBeenCalledWith('signup.income');
                expect($cookies.get).toHaveBeenCalledWith('signup.timeline');
                expect($cookies.get).toHaveBeenCalledWith('signup.birthday');
                expect($location.path).toHaveBeenCalledWith('/signup');
            });
        });
    });

    describe('transitions', () => {
        beforeEach(inject(($controller) => {
            p2pPlatformController = $controller('SignupP2pPlatformController', {
                $cookies : $cookies,
                $location : $location
            });
        }));

        it('should specify the classes used for transition', () => {
            expect(p2pPlatformController.pageClass).toBe('signup-login blue');
        });
    });

    describe('submit', () => {
        beforeEach(inject(($controller) => {
            p2pPlatformController = $controller('SignupP2pPlatformController', {
                $cookies : $cookies,
                $location : $location
            });
        }));

        describe('chose platform is part of the list', () => {
            let platform;

            beforeEach(() => {
                platform = Object.keys(p2pPlatformController.platforms)[0];
                p2pPlatformController.submit(platform);
            });

            it('should store the platform in a cookie', () => {
                expect($cookies.put).toHaveBeenCalledWith('signup.originator', platform);
            });

            it('should go to the yearly income page', () => {
                expect($location.path).toHaveBeenCalledWith('/signup/p2pCredentials');
            });
        });

        describe('chose platform is NOT part of the list', () => {
            let platform;

            beforeEach(() => {
                platform = 'hack my platform';
                p2pPlatformController.submit(platform);
            });

            it('should NOT store the platform in a cookie', () => {
                expect($cookies.put).not.toHaveBeenCalled();
            });

            it('should NOT go to the yearly income page', () => {
                expect($location.path).not.toHaveBeenCalledWith('/signup/p2pCredentials');
            });
        });
    });

    describe('alreadyAdded', () => {
        describe('no platform added', () => {
            beforeEach(() => {
                $cookies.getObject.and.returnValue([]);
            });

            beforeEach(inject(($controller) => {
                p2pPlatformController = $controller('SignupP2pPlatformController', {
                    $cookies : $cookies,
                    $location : $location
                });
            }));

            let result;
            beforeEach(() => {
                result = p2pPlatformController.alreadyAdded('platform1');
            });

            it('should return false', () => {
                expect(result).toBeFalsy();
            });
        });

        describe('platforms added', () => {
            let rightPlatform,
                wrongPlatform;
            beforeEach(() => {
                rightPlatform = 'platform1';
                wrongPlatform = 'platform2';

                $cookies.getObject.and.returnValue([{originator: rightPlatform}]);
            });

            beforeEach(inject(($controller) => {
                p2pPlatformController = $controller('SignupP2pPlatformController', {
                    $cookies : $cookies,
                    $location : $location
                });
            }));

            describe('check wrong platform', () => {
                let result;
                beforeEach(() => {
                    result = p2pPlatformController.alreadyAdded(wrongPlatform);
                });

                it('should return false', () => {
                    expect(result).toBeFalsy();
                });
            });

            describe('check right platform', () => {
                let result;
                beforeEach(() => {
                    result = p2pPlatformController.alreadyAdded(rightPlatform);
                });

                it('should return true', () => {
                    expect(result).toBeTruthy();
                });
            });
        });
    });

    describe('skip', () => {
        let platforms;

        beforeEach(inject(($controller) => {
            platforms = [{originator: 'platform'}];
            $cookies.getObject.and.returnValue([platforms]);

            p2pPlatformController = $controller('SignupP2pPlatformController', {
                $cookies : $cookies,
                $location : $location
            });
        }));

        beforeEach(() => {
            p2pPlatformController.skip();
        });

        it('should update the platforms cookie', () => {
            expect($cookies.putObject).toHaveBeenCalled();
        });

        it('should redirect the user to personal infos', () => {
            expect($location.path).toHaveBeenCalledWith('/signup/personalInfos');
        });
    });
});