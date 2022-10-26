const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const goalSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goal_name: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Goal", goalSchema, "goals");
