var app = angular.module('app', []);
app.controller("userCtrl", ["$scope", "$http", function ($scope, $http) {
    $scope.http = $http;

    $scope.appName = "weserve";
    $scope.getAppName = getAppName;

    $scope.dGetAppName = dGetAppName;
    $scope.sendSample = sendSample;

    $scope.webTag = 'MissionList';

    // dewei added
    $scope.isLogin = false;
    $scope.username = "";
    $scope.password = "";
    $scope.personInfo = {
        id: "w0923md23",
        username: "david",
        password: "123",
        avatar: "/client/resources/test.jpg",
        tags: ["C++", "driver", "traveller"],
        level: 34,
        mark: 3000,
        missionOngoing: [0, 1, 2, 3],
        missionDone: [4, 5, 6, 7],
        missionIssued: [1,2,4,5]
    };
    $scope.friends = [
        {friendName: "Josh", message: [
                { sent: "Mason", text: "Hi you are great"},
                { sent: "Josh", text: "I am fine and you" }
            ]
        },
    ];

    $scope.eventSource = null;
    $scope.getTimeFromNow = getTimeFromNow;
    $scope.sendMessage = sendMessage;
    $scope.getMessageList = getMessageList;

    // dewei specialized
    $scope.dLogin = dLogin;
    $scope.dGetLevelImage = dGetLevelImage;
    $scope.deweiTest  = deweiTest;
    $scope.missionDoneList = [];
    $scope.missionIssuedList = [];
    $scope.missionOngoingList = [];
    $scope.newMissionList = []
    $scope.levelImages = [];
    $scope.getSubstr = getSubstr;
    $scope.showMissionIssued = showMissionIssued;
    $scope.TakeMission = TakeMission;
    $scope.CompleteMission = CompleteMission;

    // Shawnny specified
    $scope.resendOrNot = false;
    $scope.sIssue = sIssue;
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


function updatePersonInfo(scope) {
    dGetLevelImage(scope, scope.personInfo.level);
    getMissionDoneInfo(scope, scope.personInfo.missionDone);
    getMissionIssuedInfo(scope, scope.personInfo.missionIssued);
    getMissionOngoingInfo(scope, scope.personInfo.missionOngoing);
    getNewMissionList(scope);
}

const serverURL = "http://localhost:3000";

function dLogin(scope) {
    let username = scope.username;
    let password = scope.password;

    scope.http({
        method: 'GET',
        url: '/login',
        params: {
            username: username,
            password: password
        }
    }).then((data, status) => {
        scope.personInfo = data.data;
        if (!scope.isLogin) {
            scope.isLogin = true;
            var eventSourceInitDict = {headers: {'Content-Type': 'application/json'}};
            scope.eventSource = new EventSource(serverURL + '/events/' + scope.personInfo.username, eventSourceInitDict);
            scope.eventSource.onmessage = (message) => {
                console.log(message);
                const data = JSON.parse(message.data);
                if (data.event === "missionTaken" || data.event === "missionCompleted") {
                    dLogin(scope);
                }
                if (data.event === "messageUpdate") {
                    getMissageList(scope);
                }
            }
            getMessageList(scope);
        }
        scope.isLogin = true;
        console.log("Login successfully");
        updatePersonInfo(scope);
    });
}




function getSubstr(scope, str, begin, num) {
    return str.substr(begin, num);
}

function getTimeFromNow(scope, timeStr) {
    console.log(timeStr);
    let now = new Date();
    let issueDate = new Date(timeStr);
    if (now - issueDate < 60000) {
        return 'less than 1 mins ago';
    }
    if (now - issueDate < 3600000) {
        return `${Math.floor((now - issueDate) / 60000)} mins ago`
    }

    if (now - issueDate < 86400000) {
        return `${Math.floor((now - issueDate) / 3600000)} hour(s) ago`
    }
    else {
        return `${Math.floor((now - issueDate) / 86400000)} days(s) ago`;
    }
}

function showMissionIssued(scope, mission) {
    let result = mission.issuer !== scope.personInfo._id && mission.status != 2;
}


function TakeMission(scope, missionId, takerName) {
    console.log(takerName);
    scope.http({
        method: 'GET',
        url: '/takeMission',
        params: {
            missionId: missionId,
            username: takerName,
        }
    }).then((data, status) => {
        console.log("Mission is marked as taken");
    })
}

function CompleteMission(scope, missionId, username) {
    scope.http({
        method: 'GET',
        url: '/completeMission',
        params: {
            missionId: missionId,
            username: username,
        }
    }).then((data, status) => {
        console.log("Mission is marked as completed");
    })
}
