/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'ngResource', 'ngAnimate', 'toastr'])
        .config(config)
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
            .otherwise({ redirectTo: '/' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
    }
})();
