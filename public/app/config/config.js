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
        .config(config);


        config.$inject = ['$routeProvider', '$locationProvider'];
        function config($routeProvider) {
            $routeProvider
                .when('/signin', {
                    templateUrl: "assets/app/signin/signin.html",
                    controller: "SignInController",
                    controllerAs: 'vm'
                })
                .when('/signin/forgotPassword', {
                    templateUrl: "assets/app/signin/forgotPassword/forgotPassword.html",
                    controller: "ForgotPasswordController",
                    controllerAs: 'vm'
                })
                .when('/reinitializePassword/:token', {
                    templateUrl: "assets/app/reinitializePassword/reinitializePassword.html",
                    controller: "ReinitializePasswordController",
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
                .when('/platforms/strategies/:platform/auto', {
                    templateUrl: "assets/app/platforms/automatedStrategyEdit/automatedStrategyEdit.html",
                    controller: "AutomatedStrategyEditController",
                    controllerAs: 'vm'
                })
                .when('/platforms/strategies/:platform/:market', {
                    templateUrl: "assets/app/platforms/strategies/strategies.html",
                    controller: "StrategiesController",
                    controllerAs: 'vm'
                })
                .when('/platforms/strategies/:platform/:market/strategyEdit/:strategyId?', {
                    templateUrl: "assets/app/platforms/strategyEdit/strategyEdit.html",
                    controller: "StrategyEditController",
                    controllerAs: 'vm'
                })
                .when('/404', {
                    templateUrl: "assets/app/notFound/notFound.html",
                    controller: "NotFoundController",
                    controllerAs: 'vm'
                })
                .otherwise({ redirectTo: '/404' });
        }
})();
