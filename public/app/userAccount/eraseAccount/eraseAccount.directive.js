(() => {
    'use strict';

    angular
        .module('app')
        .directive('eraseAccount', eraseAccount);

    eraseAccount.$inject = ['userService', 'notificationService','authenticationService'];

      function eraseAccount(userService, notificationService, authenticationService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                userPromise: '='
            },
            templateUrl: '/assets/app/userAccount/eraseAccount/eraseAccount.html',
          };

      }
  })();
