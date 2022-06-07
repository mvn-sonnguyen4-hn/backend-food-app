const messageSchema = require("../models/message.model");
const roomSchema = require("../models/room.model");

export const addMessage = (from, to, content) => {
  return messageSchema.create({
    from,
    to,
    content,
  });
};

export const joinRoom = async (roomId, from, to,content) => {
  if (!roomId) {
    const message= await addMessage(from, to, content);
    const room= await roomSchema.create({
      users: [from, to],
      messages: [message._id],
      last_message:content
    });
    return room;
  }
  const room = await roomSchema.findById(roomId);
  if (room) {
    if (room.users.includes(from) && room.users.includes(to)) {
      const message = await addMessage(from, to, content);
      room.messages.push(message._id);
      room.last_message = content;
      await room.save();
      return true
    }
  }
  return false;
};
