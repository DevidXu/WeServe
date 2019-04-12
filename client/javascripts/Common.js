var app = angular.module('app', []);
app.controller("userCtrl", ["$scope", "$http", function ($scope, $http) {
    $scope.http = $http;

    $scope.appName = "weserve";
    $scope.getAppName = getAppName;

    $scope.dGetAppName = dGetAppName;
    $scope.sendSample = sendSample;

    $scope.webTag = 'MissionList';
}]);

/*
* Guidance:
* For any function or variable, add your identifier to avoid the same name
*
* 1. How to create variable:
*   Just add in app.controller in Common.js:
*       $scope.variable_name = value;
*
* 2. How to create function:
*   Just add in XXX.js and register in Common.js:
*       $scope.function_name = function_name
*   In XXX.js, create function in such format:
*       function fname(scope, ...args) {
*           // fetch all variables you want in scope
*       }
*
* 3. How to post the backend:
*       scope.http({
            method: 'GET',
            url: '/getProducts',
            params: {
                keyword: scope.keyword,
            }
        }).then(
            ...
        );
*   // pay attention: after you update the backend, you have to restart serve (npm start) to make it work
* */
function getAppName(scope, ...args) {
    return scope.appName === scope.dGetAppName(scope);
}

function sendSample(scope, ...args) {
    scope.http({
        method: 'GET',
        url: '/sampleTest',
        params: {
            keyword: 'sample'
        }
    }).then((data, status) => {
        console.log("Return info:" + JSON.parse(data.data.info));
    });
}
