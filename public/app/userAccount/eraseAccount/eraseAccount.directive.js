(() => {
    'use strict';

    angular
        .module('app')
        .directive('eraseAccount', eraseAccount);

    eraseAccount.$inject = ['userService','authenticationService', '$window', 'SweetAlert'];

      function eraseAccount(userService, authenticationService, $window, SweetAlert) {
        return {
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: '/assets/app/userAccount/eraseAccount/eraseAccount.html',
            link(scope) {
                scope.erase = () => {
                    SweetAlert.swal({
                        title: "Account destruction",
                        text: "Please write your password in order to confirm the destruction of your account.",
                        type: "input",
                        inputType: "password",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        animation: "slide-from-top",
                        inputPlaceholder: "Your password"
                    },
                    password => {
                        if (password === false) return false;
                        if (password === "") return false;

                        userService.destroyUser(password, () => {
                            SweetAlert.swal({
                                title: "Deleted !",
                                text: "Your account has been successfully deleted. You will be redirected to the main page.",
                                type: "success",
                                closeOnConfirm: false
                            },
                            function(isConfirm) {
                              if (isConfirm) {
                                authenticationService.logout();
                                $window.location.href = '/';
                              }
                            });

                        });
                    });
                };
            }
          };
      }
  })();
