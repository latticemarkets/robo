(() => {
    'use strict';

    angular
        .module('app')
        .directive('p2pPlatform', p2pPlatform);


    p2pPlatform.$inject = ['userService', 'notificationService', 'authenticationService', 'constantsService','portfolioSimulationService','spinnerService'];

    function p2pPlatform(userService, notificationService, authenticationService, constantsService, portfolioSimulationService,spinnerService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                userPromise: '='
            },
            templateUrl: '/assets/app/userAccount/p2pPlatform/p2pPlatform.html',
            link(scope) {
                scope.availableOptions = portfolioSimulationService.portfolioKeysValues;

                scope.userPromise.then(response => {
                    scope.platforms = response.data.platforms;
                    scope.platforms = scope.platforms.filter(platform => platform.apiKey.length > 0);
                });

                scope.submit = () => {
                    const filledPlatforms = scope.platforms.filter(platform => platform.apiKey.length > 0);
                    if (filledPlatforms.length > 0) {
                        spinnerService.on();
                        userService.updatePlatforms(
                            authenticationService.getCurrentUsersEmail(),
                            scope.platforms.filter(platform => platform.apiKey.length > 0),
                            () => {
                                spinnerService.off();
                                notificationService.success('Account ID and API key added');
                            }
                        );
                    }
                    else {
                        notificationService.error('You have to link at least one platform');
                    }
                };

                scope.delete = (platform) => {
                  const name = platform.name;
                  spinnerService.on();
                  const newPlatforms = scope.platforms.filter(platform => platform.name !== name );
                  userService.updatePlatforms(
                      authenticationService.getCurrentUsersEmail(),
                      newPlatforms,
                      () => {
                          spinnerService.off();
                          notificationService.success('Delete platform');
                          scope.platforms = newPlatforms;
                      }
                  );
                };
            }
        };

    }
})();
