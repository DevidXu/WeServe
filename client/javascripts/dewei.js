/*
* To avoid function rename, please write functions starting with your first letter
* */
function dGetAppName(scope, ...args) {
    return scope.appName;
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
    scope.levelImages = images;
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


function getNewMissionList(scope) {
    scope.newMissionList = [];
    scope.http({
        method: 'GET',
        url: '/getNewMission',
        params: {
            personInfo: JSON.stringify(scope.personInfo),
        }
    }).then((data, status) => {
        scope.newMissionList = data.data;
    })
}


function getMessageList(scope) {
    scope.friends = [];
    scope.http({
        method: '/GET',
        url: '/getMessageList',
        params: {
            personInfo: JSON.stringify(scope.personInfo),
        }
    }).then((data, status) => {
        scope.friends = data.data;
    })
}

function sendMessage(scope, username, targetName, text) {
    scope.friends = [];
    scoep.http({
        method: '/GET',
        url: '/sendMessage',
        params: {
            username: username,
            targetName: targetName,
            text: text
        }
    }).then((data, status) => {
       console.log("Message sent!");
    });
}


function deweiTest(scope) {
    return scope;
}
