/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

(() => {
    'use strict';

    angular
        .module('app')
        .run(run);


    run.$inject = ['$rootScope', '$location', '$window', '$cookies', '$http', '$injector'];
    function run($rootScope, $location, $window, $cookies, $http, $injector) {

        $rootScope.globals = $cookies.getObject('globals') || {};

        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['X-TOKEN'] = $rootScope.globals.currentUser.token; // jshint ignore:line
            $http.defaults.headers.common['USER'] = $rootScope.globals.currentUser.email; // jshint ignore:line
            $cookies.putObject('globals', $rootScope.globals, {expires: moment().add(30, 'minutes').toDate()});
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var loggedIn = $rootScope.globals.currentUser;

            if (!authorizedPage() && (!loggedIn || loggedIn === undefined)) {
                $injector.invoke(['$route', $route => {
                    if (Object.keys($route.routes).some(route => route === $location.path())) {
                        if ($cookies.get('connected')) {
                            $cookies.remove('connected');
                            $window.location.href = '/?flag=expired';
                        }
                        else {
                            $window.location.href = '/?flag=unauthorized';
                        }
                    }
                    else {
                        $location.path('/404');
                    }
                }]);
            }
        });

        function authorizedPage() {
            return $.inArray($location.path(),
                    ['',
                        '/404',
                        '/signup',
                        '/signup/termsAndConditions',
                        '/signup/reasonInvestment',
                        '/signup/yearlyIncome',
                        '/signup/timeline',
                        '/signup/birthday',
                        '/signup/p2pPlatform',
                        '/signup/p2pCredentials',
                        '/signup/personalInfos',
                        '/signup/registered',
                        '/signin',
                        '/signin/forgotPassword',
                        '/reinitializePassword']
                ) > -1;
        }
    }
})();
