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


function dGetPersonalInfo(username, password, response) {
    let personInfo = {};
    console.log("Get personal info: "+username);
    userInfo.find({ username: username, password: password}).then(results => {
        if (results.length === 0) return;
        console.log("Get personal info");
        personInfo = results[0];
        let userId = personInfo._id;
        missions.find({doneBy: username, status: 2}).then(res => {
            personInfo.missionDone = res;
            missions.find({ issuer: username }).then(res => {
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
    });
}

function cCompleteMission(missionId, username, response) {
    missions.update({ _id: missionId }, { status: 2 }).then(results => {
        response.send("Success");
    })
}


module.exports = {
    dGetPersonalInfo: dGetPersonalInfo,
    dGetMissionInfo: dGetMissionInfo,
    sIssueMission: sIssueMission,
    cGetNewMission: cGetNewMission,
    cTakeMission: cTakeMission,
    cCompleteMission: cCompleteMission
};
