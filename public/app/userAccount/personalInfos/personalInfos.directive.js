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

              scope.availableOptions = [
                  {id:'1', name: 'January'},
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
                  {id:'12', name: 'December'}
              ];

              scope.userPromise.then(response => {
                  scope.firstName = response.data.firstName;
                  scope.lastName = response.data.lastName;
                  scope.birthday = response.data.birthday;
                  scope.timeStamp = scope.birthday;
                  scope.date = new Date(scope.timeStamp);
                  scope.year = scope.date.getFullYear();
                  scope.day = scope.date.getDate();
                  const month = scope.date.getMonth();
                  scope.month = scope.availableOptions[month];
              });

              function isNumeric(n) {
                  return !isNaN(parseFloat(n)) && isFinite(n) || n === null;
              }

              function allConditionsSatisfied() {
                  const month = (scope.month) ? isNumeric(scope.month.id) && scope.month.id > 0 && scope.month.id <= 12 : false;
                  const day = isNumeric(scope.day) && scope.day > 0 && scope.day <= 31;
                  const year = isNumeric(scope.year) && scope.year > 1900 && scope.year < (new Date().getFullYear() - 18);
                  return month && day && year;
              }

              scope.disableSubmitButton = () => !allConditionsSatisfied();

              scope.submit = () => {
                if (allConditionsSatisfied()) {
                    scope.spinner = true;
                    userService.updatePersonalData(
                        authenticationService.getCurrentUsersEmail(),
                        scope.firstName,
                        scope.lastName,
                        scope.birthday = scope.month.id + "/" + scope.day + "/" + scope.year,
                        () => {
                                scope.spinner = false;
                                notificationService.success('Personal infos changed');
                        }
                    );
                  }
              };

            }
        };

    }
})();
