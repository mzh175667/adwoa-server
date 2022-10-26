import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    lastMessage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    click: {
      type: Boolean,
      defaut: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Room", roomSchema, "rooms");
