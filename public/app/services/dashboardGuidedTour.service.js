/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
 * @author : bastienguerineau
 * Created on 19/02/2016
 */

 (() => {
      'use strict';

      class dashboardGuidedTourService{
        constructor(){
          this.tour = new Tour({
            steps: [
            {
              element: ".light-version",
              title: "PDX Robo",
              content: "Welcome in your dashboard PDX Robo."
            },
            {
              element: ".stats-label.text-color.menu",
              title: "Account",
              content: "This is your account and balance."
            },
            {
              element: ".info",
              title: "Infos",
              content: "This is your high level info.",
              placement: "bottom"
            },
            {
              element: ".capital",
              title: "Your capital",
              content: "This is your capital section."
            },
            {
              element: ".availableInvestment",
              title: "Available for investment",
              content: "This is your available for investment."
            },
            {
              element: ".allocatedInvestments",
              title: "Allocated on investments",
              content: "This is your allocated for investments."
            },
            {
              element: ".portfolioDiversification",
              title: "Portfolio diversification",
              content: "This is your portfolio diversification."
            },
            {
              element: ".returnInvestment",
              title: "Return on investment",
              content: "This is your return on investment.",
              placement: "bottom"
            },
            {
              element: ".averageMaturity",
              title: "Average maturity",
              content: "This is your average maturity.",
              placement: "bottom"
            },
            {
              element: ".averageIntRate",
              title: "Average int rate",
              content: "This is your average int rate.",
              placement: "bottom"
            },
            {
              element: ".currentStategy",
              title: "Current strategy",
              content: "This is your current strategy."
            },
            {
              element: ".investmentsWeek",
              title: "Investments this week",
              content: "This is your investments this week."
            },
            {
              element: ".investmentWeek",
              title: "Investment week",
              content: "This is your investment this week."
            },
            {
              element: ".platformAllocation",
              title: "Platform allocation",
              content: "This is your platform allocation."
            },
            {
              element: ".riskDiversification",
              title: "Risk diversification",
              content: "This is your risk diversification.",
              placement: "left"
            }
          ],
            backdrop: true,
            storage: false
          });

          this.tour.init();
        }

        start(){
          this.tour.start();
        }

        end(){
          this.tour.end();
        }
      }

      angular
          .module('app')
          .service('dashboardGuidedTourService', dashboardGuidedTourService);

 })();
