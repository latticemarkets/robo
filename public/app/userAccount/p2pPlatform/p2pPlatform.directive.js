(() => {
    'use strict';

    angular
        .module('app')
        .directive('p2pPlatform', p2pPlatform);


    p2pPlatform.$inject = ['userService', 'notificationService', 'authenticationService',];

    function p2pPlatform(userService, notificationService, authenticationService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                userPromise: '='
            },
            templateUrl: '/assets/app/userAccount/p2pPlatform/p2pPlatform.html',
            link(scope){
                const platforms = ['lendingClub', 'prosper', 'bondora', 'ratesetter', 'fundingCircle'];

                scope.userPromise.then(response => {
                    scope.platforms = platforms.map(platform => ({ name: platform, accountId: '', apiKey: '' }));
                    response.data.platforms.forEach(platform => {
                        scope.platforms.some(scopePlatform => {
                            if (scopePlatform.name == platform.name) {
                                scopePlatform.accountId = platform.accountId;
                                scopePlatform.apiKey = platform.apiKey;
                                return true;
                            }
                        });
                    });
                    scope.platforms = scope.platforms.sort(platform => platform.apiKey.length === 0);
                });

                scope.submit = () => {
                      scope.spinner = true;
                      userService.updatePlatforms(
                          authenticationService.getCurrentUsersEmail(),
                          scope.platforms = scope.platforms.sort(platform => platform.apiKey.length === 0),
                          alert(scope.platforms),
                          () => {
                                  scope.spinner = false;
                                  notificationService.success('Account ID and API key added');
                          }
                      );
                };
            }
        };

    }
})();
