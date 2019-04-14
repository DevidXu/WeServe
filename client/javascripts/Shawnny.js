/*
* To avoid function rename, please write functions starting with your first letter
* */
function sGetAppName(scope, ...args) {
    return scope.appName;
}


function sInputCheck(scope) {
    let reward = scope.ngReward;
    let isNum = isNaN(reward);
    console.log("input check is called")
    if(isNum){
        alert("Please enter a valid number!");
    }
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
    let student = scope.ngStudent;

    let tags = [];
    if (driver) tags.push("Driver");
    if (programmer) tags.push("Programmer");
    if (designer) tags.push("Designer");
    if (cook) tags.push("Cook");
    if (plumber) tags.push("Plumber");
    if (tutor) tags.push("Tutor");
    if (math) tags.push("Math");
    if (booster) tags.push("Booster");
    if (courier) tags.push("Courier");
    if (cleaner) tags.push("Cleaner");
    if (student) tags.push("Student");

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

