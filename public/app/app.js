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
        .module('app', ['ngRoute',
            'ngCookies',
            'ngResource',
            'ngAnimate',
            'toastr',
            'ui.bootstrap',
            'angular.css.injector',
            'angular-flot',
            'camelCaseToHuman',
            'oitozero.ngSweetAlert',
            'ui.sortable',
            'rzModule',
            'ngTagsInput',
            'ui.bootstrap.modal',
            'multiStepForm',
            'jkuri.touchspin'])
        .config(config)
        .config(function(cssInjectorProvider){
            cssInjectorProvider.setSinglePageMode(true);
        })
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: "assets/app/landpage/landpage.html",
                controller: "LandpageController",
                controllerAs: 'vm'
            })
            .when('/signin', {
                templateUrl: "assets/app/signin/signin.html",
                controller: "SignInController",
                controllerAs: 'vm'
            })
            .when('/signup', {
                templateUrl: "assets/app/signup/login/signupLogin.html",
                controller: "SignupLoginController",
                controllerAs: 'vm'
            })
            .when('/signup/termsAndConditions', {
                templateUrl: "assets/app/signup/termAndCo/termAndCo.html",
                controller: "SignupTermAndCoController",
                controllerAs: 'vm'
            })
            .when('/signup/reasonInvestment', {
                templateUrl: "assets/app/signup/reasonInvestment/reasonInvestment.html",
                controller: "SignupReasonInvestmentController",
                controllerAs: 'vm'
            })
            .when('/signup/yearlyIncome', {
                templateUrl: "assets/app/signup/yearlyIncome/yearlyIncome.html",
                controller: "SignupYearlyIncomeController",
                controllerAs: 'vm'
            })
            .when('/signup/timeline', {
                templateUrl: "assets/app/signup/timeline/timeline.html",
                controller: "SignupTimelineController",
                controllerAs: 'vm'
            })
            .when('/signup/birthday', {
                templateUrl: "assets/app/signup/birthday/birthday.html",
                controller: "SignupBirthdayController",
                controllerAs: 'vm'
            })
            .when('/signup/p2pPlatform', {
                templateUrl: "assets/app/signup/p2pPlatform/p2pPlatform.html",
                controller: "SignupP2pPlatformController",
                controllerAs: 'vm'
            })
            .when('/signup/p2pCredentials', {
                templateUrl: "assets/app/signup/p2pCredentials/p2pCredentials.html",
                controller: "SignupP2pCredentialsController",
                controllerAs: 'vm'
            })
            .when('/signup/personalInfos', {
                templateUrl: "assets/app/signup/personalInfos/personalInfos.html",
                controller: "SignupPersonalInfosController",
                controllerAs: 'vm'
            })
            .when('/signup/registered', {
                templateUrl: "assets/app/signup/registered/registered.html",
                controller: "SignupRegisteredController",
                controllerAs: 'vm'
            })
            .when('/signup/portfolio', {
                templateUrl: "assets/app/signup/portfolio/portfolio.html",
                controller: "SignupPortfolioController",
                controllerAs: 'vm'
            })
            .when('/dashboard', {
                templateUrl: "assets/app/dashboard/dashboard.html",
                controller: "DashboardController",
                controllerAs: 'vm'
            })
            .when('/userAccount', {
                templateUrl: "assets/app/userAccount/userAccount.html",
                controller: "UserAccountController",
                controllerAs: 'vm'
            })
            .when('/platforms', {
                templateUrl: "assets/app/platforms/platforms.html",
                controller: "PlatformsController",
                controllerAs: 'vm'
            })
            .when('/platforms/strategies/:platform/:market', {
                templateUrl: "assets/app/platforms/strategies/strategies.html",
                controller: "StrategiesController",
                controllerAs: 'vm'
            })
            .when('/platforms/strategies/:platform/:market/strategyEdit/:ruleId?', {
                templateUrl: "assets/app/platforms/strategyEdit/strategyEdit.html",
                controller: "StrategyEditController",
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
        $rootScope.globals = $cookieStore.get('globals') || {};

        function authorizedPage() {
            return $.inArray($location.path(),
                ['',
                '/',
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
                '/signup/portfolio',
                '/signin']
            ) > -1; }

        if ($rootScope.globals.currentUser && !authorizedPage()) {
            $http.defaults.headers.common['X-TOKEN'] = $rootScope.globals.currentUser.token; // jshint ignore:line
            $http.defaults.headers.common['USER'] = $rootScope.globals.currentUser.email; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var loggedIn = $rootScope.globals.currentUser;
            if (!authorizedPage() && (!loggedIn || loggedIn === undefined)) {
                $location.path('/');
            }
        });
    }
})();
