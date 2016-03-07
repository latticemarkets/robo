/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 07/03/2016
*/

(function() {
    setBodySmall();

    setTimeout(function () {
        fixWrapperHeight();
    }, 300);

    $(window).bind("resize click", function () {
        setBodySmall();

        setTimeout(function () {
            fixWrapperHeight();
        }, 300);
    });

    function fixWrapperHeight() {

        // Get and set current height
        var headerH = 62;
        var navigationH = $("#navigation").height();
        var contentH = $(".content").height();

        // Set new height when contnet height is less then navigation
        if (contentH < navigationH) {
            $("#wrapper").css("min-height", navigationH + 'px');
        }

        // Set new height when contnet height is less then navigation and navigation is less then window
        if (contentH < navigationH && navigationH < $(window).height()) {
            $("#wrapper").css("min-height", $(window).height() - headerH  + 'px');
        }

        // Set new height when contnet is higher then navigation but less then window
        if (contentH > navigationH && contentH < $(window).height()) {
            $("#wrapper").css("min-height", $(window).height() - headerH + 'px');
        }
    }

    function setBodySmall() {
        var body = $('body');

        if ($(this).width() < 769) {
            body.addClass('page-small');
        } else {
            body.removeClass('page-small');
            body.removeClass('show-sidebar');
        }
    }
})();
