(() => {
    'use strict';

    angular
        .module('app')
        .directive('eraseAccount', eraseAccount);

    eraseAccount.$inject = ['userService', 'notificationService','authenticationService', '$timeout', '$location'];

      function eraseAccount(userService, notificationService, authenticationService, $timeout, $location) {
        return {
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: '/assets/app/userAccount/eraseAccount/eraseAccount.html',
            link(scope) {
                scope.erase = () => {
                    userService.destroyUser(authenticationService.getCurrentUsersEmail(), () => {
                        notificationService.success("Your account have been successfully deleted. You will be redirected to the main page.");
                        $timeout(() => $location.path('/'), 5000);
                    });
                };
            }
          };

      }
  })();
