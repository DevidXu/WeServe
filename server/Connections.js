const app = require('../app.js');
const md5 = require('js-md5');

let userData = {};

function getEventPath(username) {
    const url = '/events/' + md5(username);
    return url;
}

function setupConnection(username, uid) {
    const url = getEventPath(username);
    app.get(url, (req, eventRes) => {
        eventRes.writeHead(200, {
            Connection: "keep-alive",
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Access-Control-Allow-Origin": "*"
        });

        userData[uid.toString()] = eventRes;
        console.log(`Event source for ${username}: ${url}`);

        const checkItv = setInterval(function() {
            const timeCheck = { event: "timeCheck", data: new Date().toLocaleTimeString('en-US') };
            eventRes.write("data: " + JSON.stringify(timeCheck) + '\n\n');
        }, 15000);

        req.on("close", function () {
            clearInterval(checkItv);
            delete userData[uid.toString()];
        });
    });
}



function messageFriend(uid, event, data) {
    if (!userData.hasOwnProperty(uid.toString())) return false;
    let str = JSON.stringify({
        event: event,
        data: data,
    });
    userData[uid.toString()].write(`data: ${str}\n\n`);
    userData[uid.toString()].flush();

    return true;
}


module.exports = {
    setupConnection: setupConnection,
    messageFriend: messageFriend,
};
