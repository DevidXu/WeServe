

/*
* To avoid function rename, please write functions starting with your first letter
* */
function dGetAppName(scope, ...args) {
    return scope.appName;
}

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
        scope.isLogin = true;
        scope.personInfo = data.data;
        console.log("Login successfully");
        getMissionDoneInfo(scope, scope.personInfo.missionDone);
        getMissionIssuedInfo(scope, scope.personInfo.missionIssued);
        getMissionOngoingInfo(scope, scope.personInfo.missionOngoing);
    });
}

function dGetLevelImage(scope, level) {
    if (!level) return;
    let images = [];
    let id = 0;
    while (level > 16) {
        images.push({id: id++, url: "/client/resources/levels/sun.jpg"});
        level -= 16;
    }
    while (level > 4) {
        images.push({id: id++, url: "/client/resources/levels/moon.jpg"});
        level -= 4;
    }
    while (level > 0) {
        images.push({id: id++, url: "/client/resources/levels/star.jpg"});
        level -= 1;
    }
    return images;
}


function getMissionDoneInfo(scope, idList) {
    scope.missionDoneList = [];
    for (let missionId of idList) {
        scope.http({
            method: 'GET',
            url: '/getMissionInfo',
            params: {
                missionId: missionId
            }
        }).then((data, status) => {
            scope.missionDoneList.push(data.data);
        })
    }
}

function getMissionOngoingInfo(scope, idList) {
    scope.missionOngoingList = [];
    for (let missionId of idList) {
        scope.http({
            method: 'GET',
            url: '/getMissionInfo',
            params: {
                missionId: missionId
            }
        }).then((data, status) => {
            scope.missionOngoingList.push(data.data);
        })
    }
}

function getMissionIssuedInfo(scope, idList) {
    scope.missionIssuedList = [];
    for (let missionId of idList) {
        scope.http({
            method: 'GET',
            url: '/getMissionInfo',
            params: {
                missionId: missionId
            }
        }).then((data, status) => {
            scope.missionIssuedList.push(data.data);
        })
    }
}


function deweiTest(scope) {
    return scope;
}
