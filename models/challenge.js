import mongoose from "mongoose";
import { APP_URL } from "../config";

const Schema = mongoose.Schema;

const challengeSchema = new Schema(
  {
    title: { type: String, required: true },
    nOfOrder: { type: Number, required: true },
    pointsEarned: { type: Number, required: true },
    validDate: {
      type: String,
      require: true,
    },
    startDate: { type: String },
    endDate: { type: String },
    shortDes: { type: String },
    desc: { type: String },
    status: { type: String, default: "pending" },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model("Challenge", challengeSchema, "challenges");
