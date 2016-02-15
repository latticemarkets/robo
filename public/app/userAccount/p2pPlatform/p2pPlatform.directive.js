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
                const platforms = constantsService.platforms();
                scope.availableOptions = portfolioSimulationService.portfolioKeysValues;

                scope.userPromise.then(response => {
                    scope.platforms = platforms.map(platform => ({ name: platform, accountId: '', apiKey: '', strategy: '', rules: '' }));
                    response.data.platforms.forEach(platform => {
                        scope.platforms.some(scopePlatform => {
                            if (scopePlatform.name == platform.name) {
                                scopePlatform.accountId = platform.accountId;
                                scopePlatform.apiKey = platform.apiKey;
                                scopePlatform.strategy = platform.strategy;
                                return true;
                            }
                        });
                    });
                    scope.platforms = scope.platforms.sort(platform => platform.apiKey.length === 0);
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
            }
        };

    }
})();
