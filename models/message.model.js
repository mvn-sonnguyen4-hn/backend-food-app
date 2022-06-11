const mongoose = require("mongoose");
const userSchema=require("../models/user.model");
const MessageSchema = mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:userSchema
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:userSchema
    },
    content:{
        type:String,
        default:''
    },
    status:{
        type:Number,
        default:0
    },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Messages", MessageSchema);
