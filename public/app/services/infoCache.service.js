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
    class infosCacheService {
        constructor(userService) {
            this.userDataPromise = userService.userData(response => {
                this.username = `${response.data.firstName} ${response.data.lastName}`;
                this.platforms = response.data.platforms.length;
            });
        }

        getUsername(callback) {
            if (this.username) {
                return callback(this.username);
            }
            else {
                this.userDataPromise.then(response => callback(`${response.data.firstName} ${response.data.lastName}`));
            }
        }

        getNumberOfPlatforms(callback) {
            if (this.nbPlatforms) {
                return callback(this.nbPlatforms);
            }
            else {
                this.userDataPromise.then(response => callback(response.data.platforms.length));
            }
        }
    }
    angular
        .module('app')
        .service('infosCacheService', infosCacheService);
})();