const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otpSchema = new Schema(
  { email: String, code: String, expireIn: Number },

  { timestamps: true }
);
// let otp = conn.model("otp", otpSchema, "otp");
module.exports = mongoose.model("Otp", otpSchema);
