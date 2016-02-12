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

    class notificationService {
        constructor(toastr, $timeout, $location) {
            this.toastr = toastr;
            this.$timeout = $timeout;
            this.$location = $location;
        }

        error(message) {
            this.toastr.error(message, 'Error');
        }

        apiError(callback) {
            return response => {
                switch(response.status) {
                    case 400:
                        this.toastr.error(response.data, 'Bad request');
                        break;
                    case 401:
                        this.toastr.error('API authentication error. You will be redirected', 'Unauthorized');
                        this.$timeout(() => this.$location.path('/'), 2000);
                        break;
                    default:
                        this.toastr.error('The server returned an unknown error.', 'Server error');
                        break;
                }
                if (callback) {
                    callback();
                }
            };
        }

        success(message) {
            this.toastr.success(message, 'Success');
        }
    }

    angular
        .module('app')
        .service('notificationService', notificationService)
        .config((toastrConfig) => angular.extend(toastrConfig, {
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
            })
        );
})();