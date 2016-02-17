(() => {
    'use strict';

    class spinnerService {
        constructor() {
            this.callback = () => {};
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
