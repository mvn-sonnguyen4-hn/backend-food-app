const io = require("socket.io")(8900, {
  cors: {
    origin: process.env.DOMAIN,
  },
});
const roomSchema = require("../models/room.model");
const messageSchema = require("../models/message.model");
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text, user }) => {
    const user = getUser(receiverId);
    if (user) {
      let room = await roomSchema.findOne ({
        messages: { $all: [senderId, receiverId] },
      });
      if(!room){
        room = await roomSchema.create({
          users: [senderId, receiverId],
          messages: [],
          last_message: text
        })
      }
      const message = await messageSchema.create({
        from: senderId,
        to: receiverId,
        content: text,
      })

      room.messages.push(message)
      messages.last_message = text;
      await room.save();
    }
    io.to(user.socketId).emit("getMessage", {
      senderId,
      receiverId,
      text,
      createAt: Date.now(),
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
