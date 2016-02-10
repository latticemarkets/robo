(() => {
    'use strict';

    angular
        .module('app')
        .directive('personalInfos', personalInfos);

    personalInfos.$inject = ['userService', 'notificationService'];

      function personalInfos(userService, notificationService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                userPromise: '='
            },
            templateUrl: '/assets/app/userAccount/personalInfos/personalInfos.html',
            link(scope){

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
