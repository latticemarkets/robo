/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 28/01/2016
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('NotificationService', NotificationService)
        .config(function(toastrConfig) {
            angular.extend(toastrConfig, {
                "closeButton": true,
                "debug": false,
                "progressBar": true,
                "preventDuplicates": false,
                "positionClass": "toast-top-center",
                "onclick": null,
                "showDuration": "400",
                "hideDuration": "1000",
                "timeOut": "7000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            });
        });

    NotificationService.$inject = ['toastr'];

    function NotificationService(toastr) {
        var error = function() {
            toastr.error('Wrong email / password.', 'Error');
        };

        return {
            error: error
        };
    }
})();