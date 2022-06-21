const roomSchema = require("../models/room.model");

const getMessageByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await roomSchema.findOne({
      users: { "$in" : [id] },
    }).populate('messages.message');
    return res.status(200).json({ data: result.messages });
  } catch (err) {
    res.status(500).json({ msg: new Error(err).message });
  }
};

const getRoomsByAdmin = async (req, res) => {
  try{
    const { id } = req.params;
    const result = await roomSchema.find({
      users: { "$in" : [id] },
    }).populate('messages.message').populate('users');
    return res.status(200).json({ data: result });
  }
  catch(err){
    res.status(500).json({ msg: new Error(err).message });
  }
}

module.exports = { getMessageByUserId,getRoomsByAdmin };
