/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
 * @author : bastienguerineau
 * Created on 24/02/2016
 */
describe('AutomatedStrategyEditController', () => {
    let automatedStrategyEditController,
        $timeout,
        onResizeService,
        $scope,
        autoStrategyChartsService,
        $location,
        spinnerService,
        strategiesService,
        automatedStrategyEditService,
        c3,
        SweetAlert;

    beforeEach(module('app'));

    let urlOriginator;
    beforeEach(() => {
        urlOriginator = 'a';
    });

    let onDestroyCallback;
    beforeEach(() => {
        $location = jasmine.createSpyObj('$location', ['path']);

        spinnerService = jasmine.createSpyObj('spinnerService', ['on', 'off']);

        $scope = jasmine.createSpyObj('$scope', ['$on', '$broadcast']);
        $scope.$on.and.callFake((id, callback) => onDestroyCallback = callback);
    });

    let getAutomatedStrategyCallback,
        updateAutomatedStrategyCallback;
    beforeEach(() => {
        strategiesService = jasmine.createSpyObj('strategiesService', ['getAutomatedStrategy', 'updateAutomatedStrategy']);
        strategiesService.getAutomatedStrategy.and.callFake((platform, callback) => getAutomatedStrategyCallback = callback);
        strategiesService.updateAutomatedStrategy.and.callFake((platform, aggressivity, primaryMarketEnabled, secondaryMarketEnabled, callback) => updateAutomatedStrategyCallback = callback);
    });

    let getStrategySimulationsCallback,
        platform;
    beforeEach(() => {
        platform = 'a';

        automatedStrategyEditService = jasmine.createSpyObj('automatedStrategyEditService', ['getStrategySimulations', 'getPlatformFromUrl']);
        automatedStrategyEditService.getStrategySimulations.and.callFake((originator, callback) => getStrategySimulationsCallback = callback);
        automatedStrategyEditService.getPlatformFromUrl.and.returnValue(platform);
    });

    let addOnResizeCallback;
    beforeEach(() => {
        onResizeService = jasmine.createSpyObj('onResizeService', ['addOnResizeCallback', 'removeOnResizeCallback']);
        onResizeService.addOnResizeCallback.and.callFake((callback, id) => addOnResizeCallback = callback);
    });

    beforeEach(() => {
        autoStrategyChartsService = jasmine.createSpyObj('autoStrategyChartsService', ['getSplineChartOptions', 'getBarChartOptions', 'prepareSplineChartColumns', 'prepareBarChartColumn']);
    });

    beforeEach(() => {
        c3 = jasmine.createSpyObj('c3', ['generate']);
    });

    beforeEach(() => {
        SweetAlert = jasmine.createSpyObj('SweetAlert', ['swal']);
    });

    beforeEach(inject(($controller, _$timeout_) => {
        automatedStrategyEditController = $controller('AutomatedStrategyEditController', {
            $timeout: _$timeout_,
            onResizeService: onResizeService,
            $scope: $scope,
            autoStrategyChartsService: autoStrategyChartsService,
            $location: $location,
            spinnerService: spinnerService,
            strategiesService: strategiesService,
            automatedStrategyEditService: automatedStrategyEditService,
            c3: c3,
            SweetAlert
        });
        $timeout = _$timeout_;
    }));

    describe('data initialization from service', () => {
        it('should get the automated strategy', () => {
            expect(strategiesService.getAutomatedStrategy).toHaveBeenCalled();
        });

        describe('automatedStrategy callback', () => {
            let aggressivity,
                primaryMarketEnabled,
                secondaryMarketEnabled;

            beforeEach(() => {
                aggressivity = '0.1';
                primaryMarketEnabled = true;
                secondaryMarketEnabled = false;
                getAutomatedStrategyCallback({data: {aggressivity: aggressivity, primaryMarketEnabled: primaryMarketEnabled, secondaryMarketEnabled: secondaryMarketEnabled}});
            });

            it('should get strategy simulations', () => {
                expect(automatedStrategyEditService.getStrategySimulations).toHaveBeenCalled();
            });

            describe('main callback', () => {
                let steps,
                    median,
                    min95,
                    max95;
                beforeEach(() => {
                    median = 1;
                    min95 = 2;
                    max95 = 3;
                    steps = [{ median: median, min95: min95, max95: max95}];
                    getStrategySimulationsCallback({data: { steps: steps }})
                });

                it('should populate strategyValue with 10 times it original value', () => {
                    expect(automatedStrategyEditController.strategyValue).toBe(aggressivity * 10);
                });

                it('should populate primaryMarketEnabled', () => {
                    expect(automatedStrategyEditController.primaryMarketEnabled).toBe(primaryMarketEnabled);
                });

                it('should populate secondaryMarketEnabled', () => {
                    expect(automatedStrategyEditController.secondaryMarketEnabled).toBe(secondaryMarketEnabled);
                });

                it('should populate simulatioSteps', () => {
                    expect(automatedStrategyEditController.simulationSteps).toEqual(steps);
                });

                describe('simulation metrics', () => {
                    beforeEach(() => {
                        automatedStrategyEditController.strategyValue = 0;
                    });

                    it('should create a median function returning the right median', () => {
                        expect(automatedStrategyEditController.median()).toBe(median);
                    });

                    it('should create a min95 function returning the right min95', () => {
                        expect(automatedStrategyEditController.min95()).toBe(min95);
                    });

                    it('should create a max95 function returning the right max95', () => {
                        expect(automatedStrategyEditController.max95()).toBe(max95);
                    });
                });

                describe('charts ansd slider initialization', () => {
                    beforeEach(() => {
                        $timeout.flush();
                    });

                    it('should generate c3 charts', () => {
                        expect(c3.generate).toHaveBeenCalled();
                    });

                    it('should resize the slider', () => {
                        expect($scope.$broadcast).toHaveBeenCalledWith('reCalcViewDimensions');
                    });
                });

                describe('charts resize lib init', () => {
                    it('should set a callback to redraw the charts automatically', () => {
                        expect(onResizeService.addOnResizeCallback).toHaveBeenCalled();
                    });

                    describe('addOnResizeCallback', () => {
                        beforeEach(() => {
                            addOnResizeCallback();
                        });

                        it('should redraw the chart', () => {
                            expect(c3.generate).toHaveBeenCalled();
                        });
                    });
                });

                describe('sliderOptions init', () => {
                    let expectedSliderOptions;

                    beforeEach(() => {
                        expectedSliderOptions = {
                            floor: 0,
                            ceil: 100,
                            step: 1,
                            translate: jasmine.any(Function),
                            onChange: jasmine.any(Function),
                            onEnd: jasmine.any(Function),
                            hideLimitLabels: true
                        };
                    });

                    it('should be well initialized', () => {
                        expect(automatedStrategyEditController.strategySliderOptions).toEqual(expectedSliderOptions);
                    });
                });
            });
        });

        it('should remove id from onResive service on destroy', () => {
            expect($scope.$on).toHaveBeenCalledWith('$destroy', jasmine.any(Function));

            describe('removeOnResizeCallback', () => {
                beforeEach(() => {
                    onDestroyCallback();
                });

                it('should ', () => {
                    expect(onResizeService.removeOnResizeCallback).toHaveBeenCalledWith(automatedStrategyEditController.splineChartId);
                });
            });
        });
    });

    describe('cancel', () => {
        let alertCallback;
        beforeEach(() => {
            SweetAlert.swal.and.callFake((opt, callback) => alertCallback = callback);
            automatedStrategyEditController.cancel();
        });

        describe('the user confirms', () => {
            beforeEach(() => {
                const confirmed = true;
                alertCallback(confirmed);
            });

            it('should go back to platforms', () => {
                expect($location.path).toHaveBeenCalledWith('/platforms');
            });
        });

        describe('the user does not confirm', () => {
            beforeEach(() => {
                const notConfirmed = false;
                alertCallback(notConfirmed);
            });

            it('should not go back to platforms', () => {
                expect($location.path).not.toHaveBeenCalled();
            });
        });
    });

    describe('save', () => {
        beforeEach(() => {
            automatedStrategyEditController.save();
        });

        it('should set the spinner on', () => {
            expect(spinnerService.on).toHaveBeenCalled();
        });

        it('should persist the strategy', () => {
            expect(strategiesService.updateAutomatedStrategy).toHaveBeenCalledWith(
                platform,
                automatedStrategyEditController.strategyValue / 10,
                automatedStrategyEditController.primaryMarketEnabled,
                automatedStrategyEditController.secondaryMarketEnabled,
                jasmine.any(Function));

            describe('updateAutomatedStrategy\'s callback', () => {
                beforeEach(() => {
                    updateAutomatedStrategy();
                });

                it('should set the spinner off', () => {
                    expect(spinnerService.off).toHaveBeenCalled();
                });

                it('should go back to platforms page', () => {
                    expect($location.path).toHaveBeenCalledWith('/platforms');
                });
            });
        });
    });
});
