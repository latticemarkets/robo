(() => {
    'use strict';

    class spinnerService {
        constructor() {
            this.spinner = false;
        }

        on() {
            this.spinner = true;
        }

        off() {
            this.spinner = false;
        }

        getspinnerValue() {
            return this.spinner;
        }
    }

    angular
        .module('app')
        .service('spinnerService', spinnerService);
})();
