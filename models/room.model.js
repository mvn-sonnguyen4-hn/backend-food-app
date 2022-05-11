const mongoose = require("mongoose");
const RoomSchema = mongoose.Schema({
    last_message:{
        type:String,
        default:''
    },
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'messages'
    }],
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});
const Room = (module.exports = mongoose.model("Room", RoomSchema));
