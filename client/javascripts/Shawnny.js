/*
* To avoid function rename, please write functions starting with your first letter
* */
function sGetAppName(scope, ...args) {
    return scope.appName;
}

function sIssue(scope){
    let eventTitle = scope.ngEventTitle;
    let eventDescription = scope.ngEventDescription;
    let distance = scope.ngDistance;
    let reward = scope.ngReward;
    let level = scope.ngLevel;

    let driver = scope.ngDriver;
    let programmer = scope.ngProgrammer;
    let designer = scope.ngDesigner;
    let cook = scope.ngCook;
    let plumber = scope.ngPlumber;
    let tutor = scope.ngTutor;
    let math = scope.ngMath;
    let booster = scope.ngBooster;
    let courier = scope.ngCourier;
    let cleaner = scope.ngCleaner;
    let tags = [];
    if (driver) tags.push("driver");
    if (programmer) tags.push("programmer");
    if (designer) tags.push("designer");
    if (cook) tags.push("cook");
    if (plumber) tags.push("plumber");
    if (tutor) tags.push("tutor");
    if (math) tags.push("math");
    if (booster) tags.push("booster");
    if (courier) tags.push("courier");
    if (cleaner) tags.push("cleaner");

    scope.http({
        method:'GET',
        url:'/issueMission',
        params:{
            issuer: scope.personInfo.username,
            title: eventTitle,
            description: eventDescription,
            tags: tags,
            status: 0,
            reward: reward,
            level: level,
            location: "downtown LA",
            doneBy: ""
        }
    }).then(res => {
        scope.resendOrNot = true;
    });
}

