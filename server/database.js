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
    console.log("Get personal info"+username+password);
    userInfo.find({ username: username, password: password}).then(results => {
        if (results.length === 0) return;
        console.log("Get personal info");
        personInfo = results[0];
        let userId = personInfo._id;
        missions.find({doneBy: userId, status: 2}).then(res => {
            personInfo.missionDone = res;
            missions.find({ issuer: userId }).then(res => {
                personInfo.missionIssued = res;
                missions.find({ doneBy: userId, status: 1 }).then(res => {
                    personInfo.missionOngoing = res;

                    console.log(personInfo);
                    console.log(personInfo.missionDone);
                    let info = JSON.stringify(personInfo);
                    // console.log(info);

                    response.send(JSON.stringify(personInfo));
                    return;
                })
            })
        });
    });
}

function getMissionDone(scope, userId) {
    missions.find({ doneBy: userId, status: 1 }).then(res => {
        scope.personInfo.missionDone = res;
    });
}

function getMissionIssue(scope, userId) {
    missions.find({ issuer: userId }).then(res => {
        scope.personInfo.missionIssued = res;
    })
}

function getMissionOngoing(scope, userId) {
    missions.find({ doneBy: userId, status: 0 }).then(res => {
        scope.personInfo.missionOngoing = res;
    })
}


module.exports = {
    dGetPersonalInfo: dGetPersonalInfo,
};
