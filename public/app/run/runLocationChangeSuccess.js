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


    run.$inject = ['$rootScope', 'responsiveService', '$timeout'];
    function run($rootScope, responsiveService, $timeout) {

      $rootScope.$on('$locationChangeSuccess', () => {
          $timeout(() => {
              responsiveService.adaptWrapperHeight();
              responsiveService.adaptSidebar();
          }, 300);
      });
    }
})();
