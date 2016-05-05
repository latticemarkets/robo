/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 11/02/2016
*/

describe('StrategiesController', () => {
    let strategiesController,
        $routeParams,
        constantsService,
        $location,
        strategiesService,
        platformService,
        SweetAlert;

    beforeEach(module('app'));

    beforeEach(() => {
        $location = jasmine.createSpyObj('$location', ['path']);
        $routeParams = { platform: 'a', market: 'primary' };

        strategiesService = jasmine.createSpyObj('strategiesService', ['updateStrategies']);

        platformService = jasmine.createSpyObj('platformService', ['getPlatforms']);
        platformService.getPlatforms.and.callFake((callback) => callback(
        { data: [
            {
                originator: 'a',
                primary: {
                    buyStrategies: [
                        {name: 'rule1', isEnabled: true},
                        {name: 'rule2', isEnabled: false},
                        {name: 'rule3', isEnabled: false}
                    ]
                }
            },
            {
                originator: 'b',
                primary: {
                    buyStrategies: [
                        { name: 'rule4', isEnabled: false}
                    ]
                }
            }
        ]}));
    });

    beforeEach(() => {
        SweetAlert = jasmine.createSpyObj('SweetAlert', ['swal']);
    });

    describe('called with good URL parameter', () => {
        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms', 'markets']);
            constantsService.platforms.and.returnValue(['a']);
            constantsService.markets.and.returnValue(['primary']);
        });

        beforeEach(inject(($controller) => {
            strategiesController = $controller('StrategiesController', {
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                strategiesService: strategiesService,
                platformService: platformService,
                SweetAlert: SweetAlert
            });
        }));

        describe('parameter test', () => {
            it('should get the platforms list from constant\'s service', () => {
                expect(constantsService.platforms).toHaveBeenCalled();
            });

            it('should stay on the page', () => {
                expect($location.path).not.toHaveBeenCalled();
            });
        });

        describe('get appropriate rules', () => {
            it('should get the right rules', () => {
                expect(strategiesController.strategies.length).toBe(3);
                expect(strategiesController.strategies[0].isEnabled).toBe(true);
            });

            it('should get the strategies', () => {
                expect(platformService.getPlatforms).toHaveBeenCalled();
            });
        });

        describe('pause', () => {
            describe('on success', () => {
                beforeEach(() => {
                    strategiesService.updateStrategies.and.callFake((rules, platform, market, success, error) => success());
                    expect(strategiesController.strategies[0].isEnabled).toBeTruthy();
                    strategiesController.pause(strategiesController.strategies[0]);
                });

                it('should call strategiesService.updateStrategies', () => {
                    expect(strategiesService.updateStrategies).toHaveBeenCalled();
                });

                it('should have changed the rule.isEnabled state', () => {
                    expect(strategiesController.strategies[0].isEnabled).toBeFalsy();
                });
            });

            describe('on error', () => {
                beforeEach(() => {
                    strategiesService.updateStrategies.and.callFake((rules, platform, market, success, error) => error());
                    expect(strategiesController.strategies[0].isEnabled).toBeTruthy();
                    strategiesController.pause(strategiesController.strategies[0]);
                });

                it('should call strategiesService.updateStrategies', () => {
                    expect(strategiesService.updateStrategies).toHaveBeenCalled();
                });

                it('should have changed back the rule.isEnabled state', () => {
                    expect(strategiesController.strategies[0].isEnabled).toBeTruthy();
                });
            });
        });

        describe('delete', () => {
          describe('the user confirms', () => {
              beforeEach(() => {
                  SweetAlert.swal.and.callFake((obj, callback) => callback(true));
                  strategiesController.delete({name:'rule1'});
              });

              it('should call the sweet alert', () => {
                  expect(SweetAlert.swal).toHaveBeenCalled();
              });

              describe('on success', () => {
                  beforeEach(() => {
                      strategiesService.updateStrategies.and.callFake((rules, platform, market, success, error) => success());
                      expect(strategiesController.strategies.length).toBe(3);
                      strategiesController.delete(strategiesController.strategies[2]);
                  });

                  it('should call rules service to update the list', () => {
                      expect(strategiesService.updateStrategies).toHaveBeenCalled();
                  });

                  it('should update the scoped list of rules', () => {
                      expect(strategiesController.strategies.length).toBe(2);
                  });
              });

              describe('on error', () => {
                  beforeEach(() => {
                      strategiesService.updateStrategies.and.callFake((rules, platform, market, success, error) => error());
                      expect(strategiesController.strategies.length).toBe(3);
                      strategiesController.delete(strategiesController.strategies[2]);
                  });

                  it('should call rules service to update the list', () => {
                      expect(strategiesService.updateStrategies).toHaveBeenCalled();
                  });

                  it('should not update the scoped list of rules', () => {
                      expect(strategiesController.strategies.length).toBe(3);
                  });
              });

              it('should stay on the page', () => {
                  expect($location.path).not.toHaveBeenCalled();
              });
          });

          describe('the user doesn\'t confirm the cancellation', () => {
              beforeEach(() => {
                  SweetAlert.swal.and.callFake((obj, callback) => callback(false));
                  strategiesController.delete();
              });

              it('should call the sweet alert', () => {
                  expect(SweetAlert.swal).toHaveBeenCalled();
              });

              it('should stay on the page', () => {
                  expect($location.path).not.toHaveBeenCalled();
              });
          });
        });

        describe('rearrange priority', () => {
            beforeEach(() => {
                strategiesController.sortableOptions.update();
                strategiesController.strategies = [{name: 'rule1', isEnabled: true}, {name: 'rule3', isEnabled: false}, {name: 'rule2', isEnabled: false}];
            });

            describe('on success', () => {
                beforeEach(() => {
                    strategiesService.updateStrategies.and.callFake((rules, platform, market, success, error) => success());
                    strategiesController.sortableOptions.stop();
                });

                it('should have rearrange the rules priority', () => {
                    expect(strategiesController.strategies).toEqual([{name: 'rule1', isEnabled: true}, {name: 'rule3', isEnabled: false}, {name: 'rule2', isEnabled: false}]);
                });
            });

            describe('on error', () => {
                beforeEach(() => {
                    strategiesService.updateStrategies.and.callFake((rules, platform, market, success, error) => error());
                    strategiesController.sortableOptions.stop();
                });

                it('should rearrange back the rules priority', () => {
                    expect(strategiesController.strategies).toEqual([{name: 'rule1', isEnabled: true}, {name: 'rule2', isEnabled: false}, {name: 'rule3', isEnabled: false}]);
                });
            });
        });
    });

    describe('called with bad URL parameter', () => {

        beforeEach(() => {
            constantsService = jasmine.createSpyObj('constantsService', ['platforms']);
            constantsService.platforms.and.callFake(() => ['b']);
        });

        beforeEach(inject(($controller) => {
            strategiesController = $controller('StrategiesController', {
                $routeParams: $routeParams,
                constantsService: constantsService,
                $location: $location,
                strategiesService: strategiesService
            });
        }));

        describe('parameter test', () => {
            it('should get the platforms list from constant\'s service', () => {
                expect(constantsService.platforms).toHaveBeenCalled();
            });

            it('should be redirected to strategies\' pages', () => {
                expect($location.path).toHaveBeenCalledWith('/platforms')
            });
        });
    });
});
