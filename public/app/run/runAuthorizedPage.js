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


    run.$inject = ['$location'];
    function run($location) {

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
                    '/signin']
            ) > -1; }
      }
})();
