/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 09/03/2016
*/

(() => {
    'use strict';

    class responsiveService {
        constructor($timeout, $window) {
            this.$timeout = $timeout;
            this.$window = $window;

            this.adaptSidebar();
            this.adaptWrapperHeight();

            $(window).bind("resize click", () => {
                this.adaptSidebar();

                $timeout(() => {
                    this.runCallbacks($('#wrapper'))();
                    this.adaptWrapperHeight();
                }, 400);
            });

            this.theCallbackPool = {};
            window.onresize = this.runCallbacks($('#wrapper'));

            $timeout(() => this.currentWrapperWidth = $('#wrapper').width(), 300);
        }

        runCallbacks(container) {
            return () => {
                if (this.currentWrapperWidth !== container.width()) {
                    this.currentWrapperWidth = container.width();

                    $.map(this.theCallbackPool, callback => callback());
                }
            };
        }

        get callbackPool() {
            return this.theCallbackPool;
        }

        addOnResizeCallback(callback, id) {
            this.theCallbackPool[id] = callback;
        }

        removeOnResizeCallback(id) {
            delete this.theCallbackPool[id];
        }

        adaptSidebar() {
            var body = $('body');

            if (body.hasClass("hide-sidebar")) {
                $('#minimalize-content').css('display', '');
            }
            else if (body.hasClass("show-sidebar")) {
                $('#minimalize-content').css('display', 'none');
            }
            else {
                if (this.$window.innerWidth < 769) {
                    $('#minimalize-content').css('display', '');
                    body.addClass('page-small');
                } else {
                    $('#minimalize-content').css('display', 'none');
                    body.removeClass('page-small');
                    body.removeClass('show-sidebar');
                }
            }
        }

        adaptWrapperHeight() {
            // Get and set current height
            var headerH = 62;
            var navigationH = $("#navigation").height();
            var contentH = $(".content").height();

            // Set new height when contnet height is less then navigation
            if (contentH < navigationH) {
                $("#wrapper").css("min-height", navigationH + 'px');
            }

            // Set new height when contnet height is less then navigation and navigation is less then window
            if (contentH < navigationH && navigationH < this.$window.innerHeight) {
                $("#wrapper").css("min-height", this.$window.innerHeight - headerH  + 'px');
            }

            // Set new height when contnet is higher then navigation but less then window
            if (contentH > navigationH && contentH < this.$window.innerHeight) {
                $("#wrapper").css("min-height", this.$window.innerHeight - headerH + 'px');
            }
        }
    }

    angular
        .module('app')
        .service('responsiveService', responsiveService);
})();