(() => {
    'use strict';

    angular
        .module('app')
        .directive('personalInfos', personalInfos);

    personalInfos.$inject = ['userService', 'notificationService','authenticationService'];

      function personalInfos(userService, notificationService, authenticationService) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                userPromise: '='
            },
            templateUrl: '/assets/app/userAccount/personalInfos/personalInfos.html',
            link(scope){
              scope.data = {
                availableOptions : [{id:'1', name: 'January'},
                            {id:'2', name: 'February'},
                            {id:'3', name: 'March'},
                            {id:'4', name: 'April'},
                            {id:'5', name: 'May'},
                            {id:'6', name: 'June'},
                            {id:'7', name: 'July'},
                            {id:'8', name: 'August'},
                            {id:'9', name: 'September'},
                            {id:'10', name: 'October'},
                            {id:'11', name: 'November'},
                            {id:'12', name: 'December'}],
                selectedOption : {id:'10', name: 'October'}
              };

              scope.userPromise.then(response => {
                  scope.firstName = response.data.firstName;
                  scope.lastName = response.data.lastName;
                  scope.birthday = response.data.birthday;
                  scope.timeStamp = scope.birthday;
                  scope.date = new Date(scope.timeStamp);
                  scope.year = scope.date.getFullYear();
                  scope.day = scope.date.getDate();
                  scope.month = scope.date.getMinutes();

              });

              scope.submit = () => {
                    scope.spinner = true;
                    userService.updatePersonalData(
                        authenticationService.getCurrentUsersEmail(),
                        scope.firstName,
                        scope.lastName,
                        scope.birthday = scope.month + "/" + scope.day + "/" + scope.year,
                        () => {
                                scope.spinner = false;
                                notificationService.success('Personal infos changed');
                        }
                    );
              };

            }
        };

    }
})();
