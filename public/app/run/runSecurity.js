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


    run.$inject = ['$rootScope', '$location', '$window', '$cookies', '$http', 'editableOptions', '$injector', 'responsiveService', '$timeout'];
    function run($rootScope, $location, $window, $cookies, $http, editableOptions, $injector, responsiveService, $timeout) {
      editableOptions.theme = 'bs3';
      $rootScope.globals = $cookies.getObject('globals') || {};

      if ($rootScope.globals.currentUser) {
          $http.defaults.headers.common['X-TOKEN'] = $rootScope.globals.currentUser.token; // jshint ignore:line
          $http.defaults.headers.common['USER'] = $rootScope.globals.currentUser.email; // jshint ignore:line
          $cookies.putObject('globals', $rootScope.globals, { expires: moment().add(30, 'minutes').toDate() });
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
      $rootScope.$on('$locationChangeSuccess', () => {
          $timeout(() => {
              responsiveService.adaptWrapperHeight();
              responsiveService.adaptSidebar();
          }, 300);
      });
    }
})();
