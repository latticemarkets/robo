(() => {
    'use strict';

    angular
        .module('app')
        .directive('p2pPlatform', p2pPlatform);

    p2pPlatform.$inject = ['userService', 'notificationService'];

    function p2pPlatform(userService, notificationService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
              platforms: '@'
            },
            templateUrl: '/assets/app/userAccount/p2pPlatform/p2pPlatform.html',
            link(scope){
              scope.platforms = ['Lending Club', 'prosper','bondora', 'ratesetter', 'fundingCircle'];

              scope.submit = () => {
                      scope.spinner = true;
                      userService.updatePlatform(
                          scope.accountId,
                          scope.apiKey,
                          response => {
                                  scope.spinner = false;
                                  notificationService.success('Account ID and API key added');
                          }
                      );
              };
              }
            };

        }
})();
