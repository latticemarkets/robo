/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 26/01/2016
*/

(function() {
    'use strict';

    class SignupPortfolioController {
        constructor($location, $cookieStore, portfolioService, $timeout, portfolioSimulationService) {
            const vm = this;

            vm.pageClass = 'signup-login blue';

            vm.pageNo = 6;
            $timeout(() => vm.pageNo++, 1000);

            (() => {
                const email = $cookieStore.get('signup.email');
                const password = $cookieStore.get('signup.password');
                const terms = $cookieStore.get('signup.terms');
                const reason = $cookieStore.get('signup.reason');
                const income = $cookieStore.get('signup.income');
                const timeline = $cookieStore.get('signup.timeline');
                const birthday = $cookieStore.get('signup.birthday');

                if (!(email && password && terms && reason && income && timeline && birthday)) {
                    $location.path('/signup');
                }

                vm.portfolios = portfolioSimulationService.portfolioKeysValues;

                vm.chosePortfolioPromise = portfolioService.getPortfolioSuggestion(terms, reason, income, timeline, birthday, response => {
                    vm.chosePortfolio = response.data.portfolio;
                    vm.suggestedPortfolio = response.data.portfolio;
                });

            })();

            vm.choose = portfolio => {
                vm.chosePortfolio = portfolio;
            };

            vm.isSelected = portfolio => vm.chosePortfolio == portfolio;

            vm.submit = () => {
                if (vm.chosePortfolio) {
                    $cookieStore.put('signup.portfolio', vm.chosePortfolio);
                    $location.path('/signup/p2pPlatform');
                }
            };
        }
    }

    angular
        .module('app')
        .controller('SignupPortfolioController', SignupPortfolioController);
})();