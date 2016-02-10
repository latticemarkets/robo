(() => {
    'use strict';

    angular
        .module('app')
        .filter('titleCase', function() {
          return function(input) {
            input = input || '';
            return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          };
        })
        .directive('p2pPlatform', p2pPlatform);


    p2pPlatform.$inject = ['userService', 'notificationService'];

    function p2pPlatform(userService, notificationService) {
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
                    const obj = [];
                    response.data.platforms.forEach(platform => {
                        scope.platforms.some(scopePlatform => {
                            if (scopePlatform.name == platform.name) {
                                scopePlatform.accountId = platform.accountId;
                                scopePlatform.apiKey = platform.apiKey;
                                const sortObj = obj.push({name: platform.name, accountId: platform.accountId, apiKey: platform.apiKey});
                                return true;
                            }
                        });
                    });
                    obj.sort(platform => platform.apiKey.length === 0);
                });

                scope.submit = () => {
                      scope.spinner = true;
                      userService.updatePlatform(
                          scope.accountId,
                          scope.apiKey,
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
