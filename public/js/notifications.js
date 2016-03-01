/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 01/03/2016
*/

(function() {
    if (location.search) {
        var firstParameter = location.search.substr(1).split('=');
        if (firstParameter[0] === 'flag') {
            if (firstParameter[1] === 'unauthorized') {
                toastr.options = {
                    closeButton: true,
                    showMethod: 'slideDown',
                    preventDuplicates: true,
                    progressBar: true,
                    positionClass: "toast-top-center"
                };
                toastr.error('You tried to access a protected page without being logged in.', 'Unauthorized');
            }
        }
    }

})();