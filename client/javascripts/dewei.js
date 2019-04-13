/*
* To avoid function rename, please write functions starting with your first letter
* */
function dGetAppName(scope, ...args) {
    return scope.appName;
}

function dPersonInfoInit(scope) {

}

function dLogin(scope) {
    let username = scope.username;
    let password = scope.password;
    // validation
    scope.isLogin = true;
    return true;
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
