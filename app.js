const express = require('express');
const app = express();
const port = 3000;

const http = require('http');
const https = require('https');
var path = require('path');
var logger = require('morgan');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));


const DB = require('./server/database');
const CN = require('./server/Connections');

/* register your backend service here */
app.get('/sampleTest', (req, res) => {
    res.send(JSON.stringify({ info: "true" }));
});

app.get('/login', (req, res) => {
    let username = req.query.username;
    let password = req.query.password;
    DB.dGetPersonalInfo(username, password, res);
});

app.get('/getMissionInfo', (req, res) => {
    let missionId = req.query.missionId;
    DB.dGetMissionInfo(missionId, res);
})

app.get('/issueMission', (req, res) => {
    const { issuer,title,description, tags, status, reward, level, location,doneBy } = req.query;
    const mission = {
        issuer: issuer,
        title: title,
        description: description,
        tags: tags,
        status: status,
        reward: reward,
        level: level,
        location: location,
        doneBy: doneBy
    };
    console.log(mission);
    DB.sIssueMission(mission, res);
})

app.get('/getNewMission', (req, res) => {
    const personInfo = JSON.parse(req.query.personInfo);
    DB.cGetNewMission(personInfo, res);
})

app.get('/takeMission', (req, res) => {
    const { missionId, username } = req.query;
    DB.cTakeMission(missionId, username, res);
});

app.get('/completeMission', (req, res) => {
    const { missionId, username } = req.query;
    DB.cCompleteMission(missionId, username, res);
})



app.use('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname+"/index.html");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
