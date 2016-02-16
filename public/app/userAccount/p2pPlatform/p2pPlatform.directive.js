(() => {
    'use strict';

    angular
        .module('app')
        .directive('p2pPlatform', p2pPlatform);


    p2pPlatform.$inject = ['userService', 'notificationService', 'authenticationService', 'constantsService','portfolioSimulationService'];

    function p2pPlatform(userService, notificationService, authenticationService, constantsService, portfolioSimulationService) {
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
                        scope.spinner = true;
                        userService.updatePlatforms(
                            authenticationService.getCurrentUsersEmail(),
                            scope.platforms.filter(platform => platform.apiKey.length > 0),
                            () => {
                                scope.spinner = false;
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
                  scope.spinner = true;
                  userService.updatePlatforms(
                      authenticationService.getCurrentUsersEmail(),
                      scope.platforms.filter(platform => platform.name !== name ),
                      () => {
                          scope.spinner = false;
                          notificationService.success('Delete platform');
                      }
                  );
                };
            }
        };

    }
})();
