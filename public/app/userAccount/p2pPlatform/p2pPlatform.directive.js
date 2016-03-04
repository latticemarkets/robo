(() => {
    'use strict';

    angular
        .module('app')
        .directive('p2pPlatform', p2pPlatform);


    p2pPlatform.$inject = ['notificationService', 'spinnerService', 'platformService','SweetAlert'];

    function p2pPlatform(notificationService, spinnerService, platformService, SweetAlert) {
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

                    scope.platforms.status ={		
                        isOpen: []
                    };
                    var i;
                    const openArr = scope.platforms.status.isOpen;
                    openArr[0] = true;
                    for (i = 1; i < scope.platforms.length; i++) {
                        openArr[i] = false;
                    }
                });

                scope.submit = () => {
                    const filledPlatforms = scope.platforms.filter(platform => platform.apiKey.length > 0);
                    if (filledPlatforms.length > 0) {
                        spinnerService.on();
                        platformService.updatePlatforms(
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
                  SweetAlert.swal({
                      title: "Are you sure?",
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes",
                      cancelButtonText: "No",
                      closeOnConfirm: true,
                      closeOnCancel: true
                },
                function(isConfirm) {
                  if (isConfirm) {
                  const name = platform.originator;
                  spinnerService.on();
                  const newPlatforms = scope.platforms.filter(platform => platform.originator !== name );
                    platformService.updatePlatforms(
                      newPlatforms,
                      () => {
                          spinnerService.off();
                          notificationService.success('Delete platform');
                          scope.platforms = newPlatforms;
                          });
                        }
                    });
                };
            }
        };

    }
})();
