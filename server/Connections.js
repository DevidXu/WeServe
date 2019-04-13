const md5 = require('js-md5');

let userData = {};

function getEventPath(username) {
    const url = '/events/' + username;
    return url;
}

function setupConnection(username, uid) {
    let sourceURL = getEventPath(username);
    if (userData.hasOwnProperty(sourceURL)) return;
    console.log("Ready to setup event source: " + sourceURL);
}



function messageFriend(username, event, data) {
    const sourceURL = getEventPath(username);
    if (!userData.hasOwnProperty(sourceURL)) return false;
    let str = JSON.stringify({
        event: event,
        data: data,
    });
    userData[sourceURL].write(`data: ${str}\n\n`);
    userData[sourceURL].flush();

    return true;
}


module.exports = {
    setupConnection: setupConnection,
    messageFriend: messageFriend,
};
