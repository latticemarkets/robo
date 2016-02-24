(() => {
    'use strict';

    angular
        .module('app')
        .directive('p2pPlatform', p2pPlatform);


    p2pPlatform.$inject = ['notificationService', 'authenticationService', 'spinnerService', 'platformService'];

    function p2pPlatform(notificationService, authenticationService, spinnerService, platformService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                userPromise: '='
            },
            templateUrl: '/assets/app/userAccount/p2pPlatform/p2pPlatform.html',
            link(scope) {

                scope.userPromise.then(response => {
                    scope.platforms = response.data.platforms;
                    scope.platforms = scope.platforms.filter(platform => platform.apiKey.length > 0);
                });

                scope.submit = () => {
                    const filledPlatforms = scope.platforms.filter(platform => platform.apiKey.length > 0);
                    if (filledPlatforms.length > 0) {
                        spinnerService.on();
                        platformService.updatePlatforms(
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
                  const name = platform.originator;
                  spinnerService.on();
                  const newPlatforms = scope.platforms.filter(platform => platform.originator !== name );
                    platformService.updatePlatforms(
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
