const userInfoSchema = require('./Schema').userInfoSchema;
const missionsSchema = require('./Schema').missionSchema;
const messageSchema = require('./Schema').messageSchema;
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hacksc2019:hacksc2019!@cluster0-y0hc9.mongodb.net/admin?retryWrites=true', {useNewUrlParser: true});
defaultDB = mongoose.connection;
defaultDB.on('error',function(err){
    throw new Error("Mongo Connection Fail " + err);
});
const dbc = defaultDB.useDb('hacksc');
const userInfo = dbc.model('userInfo', userInfoSchema, 'userinfo');
const missions = dbc.model('missions', missionsSchema, 'missions');
const messages = dbc.model('messages', messageSchema, 'messages');

const CN = require('./Connections');
let userData = {};

function dGetPersonalInfo(username, password, response) {
    let personInfo = {};
    console.log("Get personal info: "+username);
    userInfo.find({ username: username, password: password}).then(results => {
        if (results.length === 0) return;
        console.log("User " + username + " login the system successfully");
        personInfo = results[0];
        let userId = personInfo._id;
        CN.setupConnection(username, userId);
        missions.find({doneBy: username, status: 2}).then(res => {
            personInfo.missionDone = res;
            missions.find({ issuer: username, status: {$in : [0, 1]} }).then(res => {
                personInfo.missionIssued = res;
                missions.find({ doneBy: username, status: 1 }).then(res => {
                    personInfo.missionOngoing = res;
                    response.send(JSON.stringify(personInfo));
                    return;
                })
            })
        });
    });
}


function dGetMissionInfo(missionId, response) {
    let missionInfo = {};
    missions.find({ _id: missionId }).then(results => {
        if (results.length === 0) {
            console.log("This mission doesn't exist");
            return;
        }
        missionInfo = results[0];
        response.send(JSON.stringify(missionInfo));
    })
}


function sIssueMission(mission, response) {
    missions.insertMany([mission]).then(results => {
        response.send("Success");
    });
}

function cGetNewMission(personInfo, response) {
    missions.find({
        status: 0,
        level: {$lt: personInfo.level },
        issuer: {$ne: personInfo.username } ,
        tags: { $in: personInfo.tags }
    }).then(results => {
        response.send(JSON.stringify(results));
    });
}

function cTakeMission(missionId, username, response) {
    console.log(missionId);
    console.log(username);
    missions.update({ _id: missionId }, { status: 1, doneBy: username }).then(results => {
        response.send("Success");
        messageFriend(username, "missionTaken", "true");
    });
    missions.find({ _id: missionId }).then(results => {
        let issuer = results[0].issuer;
        messageFriend(issuer, "missionTaken", "true");
    });
}

function cCompleteMission(missionId, username, response) {
    missions.update({ _id: missionId }, { status: 2 }).then(results => {
        response.send("Success");
        messageFriend(username, "missionCompleted", "true");
    });
    missions.find({ _id: missionId }).then(results => {
        let issuer = results[0].issuer;
        messageFriend(issuer, "missionCompleted", "true");
    });
}


function dGetMessageList(personInfo, response) {
    messages.find({ $or: [{ user1: personInfo.username }, {user2: personInfo.username}] }).sort({ created_at: -1 }).then(results => {
        let friends = {};
        let keys = [];
        for (let message of results ) {
            if (message.user1 === personInfo.username) {
                if (!friends.hasOwnProperty(message.user2)) friends[message.user2] = [];
                console.log("Begin to push");
                friends[message.user2].push({friendName: message.user2, message: { sent: message.user1, text: message.text } });
            }
            if (message.user2 === personInfo.username) {
                console.log("Begin to push");
                if (!friends.hasOwnProperty(message.user1)) friends[message.user1] = [];
                friends[message.user1].push({friendName: message.user1, message: { sent: message.user1, text: message.text } });
            }
            let target = message.user1 === personInfo.username? message.user2: message.user1;
            if (!keys.includes(target)) keys.push(target);
        }
        let sortedFriends = [];
        for (let name of keys) {
            sortedFriends.push(friends[name]);
        }
        response.send(JSON.stringify(sortedFriends));
    });
}

function dSendMessage(username, targetName, text, response) {
    console.log("Ready to send message");
    messages.insertMany([{ user1: username, user2: targetName, text: text }]).then(results => {
        response.send("Success");
        messageFriend(username, "messageUpdate", "true");
        messageFriend(targetName, "messageUpdate", "true");
    });
}


function messageFriend(username, event, data) {
    const sourceURL = "/events/"+username;
    console.log(userData);
    if (!userData.hasOwnProperty(sourceURL)) return false;
    let str = JSON.stringify({
        event: event,
        data: data,
    });
    console.log(sourceURL);
    console.log(userData[sourceURL]);
    userData[sourceURL].write(`data: ${str}\n\n`);
    userData[sourceURL].flush();

    return true;
}

module.exports = {
    dGetPersonalInfo: dGetPersonalInfo,
    dGetMissionInfo: dGetMissionInfo,
    sIssueMission: sIssueMission,
    cGetNewMission: cGetNewMission,
    cTakeMission: cTakeMission,
    cCompleteMission: cCompleteMission,
    dGetMessageList: dGetMessageList,
    dSendMessage: dSendMessage,
    userData: userData
};
