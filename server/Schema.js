const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userInfoSchema = new Schema({
    "username": {type: String, index: true, unique: true, required: true} ,
    "password": {type: String, index: true},
    "avatar": String,
    "tags": [String],
    "level": Number,
    "missionOngoing": [ ObjectId ],
    "missionDone": [ObjectId],
    "missionIssued": [ObjectId],
    "created_at": {type: Date, default: Date.now},
});
exports.userInfoSchema = userInfoSchema;

const messageSchema = new Schema({
    "user_id1": {type: String, index: true, required: true} ,
    "user_id2": {type: String, index: true, required: true},
    "text": String,
    "created_at": {type: Date, default: Date.now},
});
exports.messageSchema = messageSchema;

const missionSchema = new Schema({
    "issuer": {type: ObjectId, index: true, required: true},
    "title": {type: String, index: true, required: true},
    "description": {type: String},
    "tags": [String],
    "status": Number,
    "created_at": {type: Date, default: Date.now},
    "reward": Number,
    "level": Number,
    "location": String,
    "doneBy": ObjectId,
});
exports.missionSchema = missionSchema;
