import { Message, Personal, Room } from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";

const messageController = {
  // Get all messages using room id
  async index(req, res, next) {
    try {
      const messages = await Message.find({
        roomId: req.params.roomId,
      })
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 });

      if (messages[0] == null) {
        console.log("message not found");
        // res.status(404).json({ error: "No Record Found" });
        res.status(404).json({
          message: "messages not found",
          statusCode: 404,
          success: false,
          data: null,
        });
      } else {
        return res.status(200).json({
          message: "messages found",
          statusCode: 200,
          success: true,
          data: { messages },
        });
      }
    } catch (err) {
      console.log(err);
      console.log("Any error in saving message");
      res.status(500).json({
        message: err.message,
        statusCode: 500,
        success: false,
        data: null,
        stack: err.stack,
      });
      // res.status(404).json({ error: "user not found" });
    }
  },

  // create room by sending message first time
  async createRoom(req, res, next) {
    const { message, rid, sname } = req.body;
    try {
      const room = await Room.findOne({
        $and: [{ senderId: req.user._id }, { receiverId: rid }],
      });

      const username = await Personal.findOne({
        user: rid,
      });

      if (!username) {
        return res.status(404).json({
          message: "Please! Complete Your Profile First",
          statusCode: 404,
          success: false,
          data: null,
        });
      }

      console.log("username", username);

      let roomId = "";
      if (!room) {
        console.log("Rooom", room);
        var newRoom = await new Room({
          senderId: req.user._id,
          receiverId: rid,
          senderName: sname,
          receiverName: username.name,
          lastMessage: message,
          status: "unread",
          click: false,
        }).save();
        roomId = newRoom._id;
        await new Message({
          roomId: roomId,
          senderId: req.user._id,
          receiverId: rid,
          senderName: sname,
          receiverName: username.name,
          message: message,
          status: "unread",
          click: false,
        }).save();
      } else {
        console.log("ab room mil gaya hai us ko ");
        roomId = room._id;
        await new Message({
          roomId: roomId,
          senderId: req.user._id,
          receiverId: rid,
          senderName: sname,
          receiverName: username.name,
          message: message,
          status: "unread",
        }).save();

        const updatedLastMessage = await Room.findByIdAndUpdate(
          { _id: roomId },
          {
            lastMessage: message,
          },
          { new: true }
        );
        console.log("updated last seen message", updatedLastMessage);
      }
      return res.status(201).json({
        message: "Message sent successfully..",
        statusCode: 201,
        success: true,
        data: null,
        error: null,
      });
    } catch (err) {
      console.log(err.stack);
      console.log("Any error in saving message");
      res.status(500).json({
        message: err.message,
        statusCode: 500,
        success: false,
        data: null,
        stack: err.stack,
      });
    }
  },

  // get all my rooms
  async getAllMyRooms(req, res, next) {
    console.log("req.user", req.user._id);
    let room;
    try {
      if (req.user.role === "trainee" && !req.body.all_rooms) {
        room = await Room.find({
          $and: [
            { senderId: req.user._id },
            { receiverId: req.body.trainerId },
          ],
        }).select("-updatedAt -__v");
      } else {
        room = await Room.find({
          $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
        }).select("-updatedAt -__v");
      }

      console.log("room object", room);

      if (room.length == 0) {
        console.log("rooms not found");
        res.status(404).json({
          message: "rooms not found",
          statusCode: 404,
          success: false,
          rooms: null,
          error: "rooms does not exists in database",
        });
      } else {
        console.log(room);
        return res.status(200).json({
          message: "rooms found",
          statusCode: 200,
          success: true,
          data: { rooms: room },
          error: null,
        });
      }
    } catch (err) {
      console.log(err);
      console.log("Internal server error");
      res.status(500).json({
        message: err.message,
        statusCode: 500,
        success: false,
        rooms: null,
        stack: err.stack,
      });
    }
  },

  // send messages
  async sendMessage(req, res, next) {
    const { roomId, rid, sname, mes } = req.body;

    const user = await Personal.findOne({
      user: rid,
    });
    console.log("username", user);
    try {
      await new Message({
        roomId,
        senderId: req.user._id,
        receiverId: rid,
        message: mes,
        senderName: sname,
        receiverName: user.name,
        status: "unread",
      }).save();
      await Room.findByIdAndUpdate(
        { _id: roomId },
        {
          lastMessage: mes,
        }
      );
      return res.status(201).json({
        message: "Message sent successfully..",
        statusCode: 201,
        success: true,
        data: null,
        error: null,
      });
    } catch (err) {
      console.log(err);
      console.log("Server error");
      res.status(500).json({
        message: err.message,
        statusCode: 500,
        success: false,
        data: null,
        stack: err.stack,
      });
    }
  },
};

export default messageController;
