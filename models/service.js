const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service_name: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema, "services");
