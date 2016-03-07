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

describe('SignupP2pCredentialsController', () => {
    let p2pCredentialsController,
        $cookies,
        $location;

    beforeEach(() => {
        module('app');

        $cookies = jasmine.createSpyObj('$cookies', ['get', 'put', 'getObject', 'putObject']);
        $location = jasmine.createSpyObj('$location', ['path']);
    });

    beforeEach(inject(($controller) => {
        p2pCredentialsController = $controller('SignupP2pCredentialsController', {
            $cookies : $cookies,
            $location : $location
        });
    }));

    describe('initialization', () => {
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
                expect($cookies.get).toHaveBeenCalledWith('signup.originator');
                expect($cookies.get).toHaveBeenCalledWith('signup.extension');
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
                expect($cookies.get).toHaveBeenCalledWith('signup.originator');
                expect($cookies.get).toHaveBeenCalledWith('signup.extension');
                expect($location.path).toHaveBeenCalledWith('/signup');
            });
        });
    });

    describe('disableSubmitButton', () => {
        describe('with good values', () => {
            beforeEach(() => {
                p2pCredentialsController.accountId = "18974";
                p2pCredentialsController.apiKey = "1394";
            });

            it('should not disable the buttons', () => {
                expect(p2pCredentialsController.disableSubmitButton(() => false)).toBeFalsy();
            });
        });

        describe('with bad values', () => {
            describe('empty accountId', () => {
                beforeEach(() => {
                    p2pCredentialsController.apiKey = "2452";
                    p2pCredentialsController.accountId = undefined;
                });

                it('should disable the buttons', () => {
                    expect(p2pCredentialsController.disableSubmitButton(() => true)).toBeTruthy();
                });
            });

            describe('empty API key', () => {
                beforeEach(() => {
                    p2pCredentialsController.apiKey = undefined;
                    p2pCredentialsController.accountId = "89725";
                });

                it('should disable the buttons', () => {
                    expect(p2pCredentialsController.disableSubmitButton(() => true)).toBeTruthy();
                });
            });
        });
    });

    describe('submit', () => {
        describe('with good values', () => {
            let newPlatform;

            beforeEach(() => {
                p2pCredentialsController.accountId = "18974";
                p2pCredentialsController.apiKey = "1394";
                p2pCredentialsController.originator = 'originator1';
                newPlatform = {originator: p2pCredentialsController.originator, apiKey: p2pCredentialsController.apiKey, accountId: p2pCredentialsController.accountId};
            });

            describe('if platforms have already been filled', () => {
                let previouslyAddedPlatform;

                describe('the new platform is different from the others', () => {
                    beforeEach(() => {
                        let otherOriginator = 'previously added platform';
                        previouslyAddedPlatform = { originator: otherOriginator };
                        $cookies.getObject.and.returnValue([previouslyAddedPlatform]);
                        p2pCredentialsController.submit();
                    });

                    it('should get the platforms previously entered', () => {
                        expect($cookies.getObject).toHaveBeenCalledWith('signup.platforms');
                    });

                    it('should add the new platform to the previous ones and put the cookie', () => {
                        expect($cookies.putObject).toHaveBeenCalledWith('signup.platforms', [previouslyAddedPlatform, newPlatform]);
                    });

                    it('should go to the personal infos page', () => {
                        expect($location.path).toHaveBeenCalledWith('/signup/personalInfos');
                    });
                });

                describe('the new platform is the same as another one', () => {
                    let oldAccountId,
                        oldApiKey;

                    oldAccountId = "newAccountId";
                    oldApiKey = "newApiKey";
                    beforeEach(() => {
                        previouslyAddedPlatform = { originator: p2pCredentialsController.originator, apiKey: oldApiKey, accountId: oldAccountId };
                        $cookies.getObject.and.returnValue([newPlatform]);
                        p2pCredentialsController.submit();
                    });

                    it('should get the platforms previously entered', () => {
                        expect($cookies.getObject).toHaveBeenCalledWith('signup.platforms');
                    });

                    it('should overwrite the previous platform', () => {
                        expect($cookies.putObject).toHaveBeenCalledWith('signup.platforms', [newPlatform]);
                    });
                });
            });

            describe('if platforms have not been already filled', () => {
                beforeEach(() => {
                    $cookies.getObject.and.returnValue(undefined);
                    p2pCredentialsController.submit();
                });

                it('should get the platforms previously entered', () => {
                    expect($cookies.getObject).toHaveBeenCalledWith('signup.platforms');
                });

                it('should create an array with the new platform put the cookie', () => {
                    expect($cookies.putObject).toHaveBeenCalledWith('signup.platforms', [newPlatform]);
                });

                it('should go to the personal infos page', () => {
                    expect($location.path).toHaveBeenCalledWith('/signup/personalInfos');
                });
            });

        });

        describe('with bad values', () => {
            describe('empty accountId', () => {
                beforeEach(() => {
                    p2pCredentialsController.apiKey = "2452";
                    p2pCredentialsController.accountId = undefined;
                    p2pCredentialsController.originator = 'originator1';
                    p2pCredentialsController.submit();
                });

                it('should not add anything to cookies', () => {
                    expect($cookies.put).not.toHaveBeenCalled();
                    expect($cookies.put).not.toHaveBeenCalled();
                });

                it('should stay on the current page', () => {
                    expect($location.path).not.toHaveBeenCalledWith('/signup/personalInfos');
                });
            });

            describe('empty API key', () => {
                beforeEach(() => {
                    p2pCredentialsController.apiKey = undefined;
                    p2pCredentialsController.accountId = "89725";
                    p2pCredentialsController.originator = 'originator1';
                    p2pCredentialsController.submit();
                });

                it('should not add anything to cookies', () => {
                    expect($cookies.put).not.toHaveBeenCalled();
                    expect($cookies.put).not.toHaveBeenCalled();
                });

                it('should stay on the current page', () => {
                    expect($location.path).not.toHaveBeenCalledWith('/signup/personalInfos');
                });
            });
        });
    });
});