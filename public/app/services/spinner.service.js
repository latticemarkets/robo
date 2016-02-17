(() => {
    'use strict';

    class spinnerService {
        constructor() {
        }

        on() {
            this.callback(true);
        }

        off() {
            this.callback(false);
        }

        listenSpinnerValue(callback) {
            this.callback = callback;
        }
    }

    angular
        .module('app')
        .service('spinnerService', spinnerService);
})();
