const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notifSchema = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notif_token: {
      type: String,
    },
    
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notif_Tokens", notifSchema, "notif_tokens");
