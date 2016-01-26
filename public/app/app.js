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
        .module('app', ['ngRoute', 'ngCookies', 'ngResource', 'ngAnimate'])
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
            .when('/signup', {
                templateUrl: "assets/app/signup/login/signupLogin.html",
                controller: "SignupLoginController",
                controllerAs: 'vm'
            })
            .when('/signup/termsAndConditions', {
                templateUrl: "assets/app/signup/termAndCo/signupTermAndCo.html",
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
            .otherwise({ redirectTo: '/' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
    }
})();
