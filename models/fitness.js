import mongoose from "mongoose";

const Schema = mongoose.Schema;
const FitnessGoalSchema = mongoose.Schema({
  id: { type: Number },
  value: { type: String },
  key: { type: String },
});
const ServicesSchema = mongoose.Schema({
  id: { type: Number },
  value: { type: String },
  key: { type: String },
});
const FitnessLevelSchema = mongoose.Schema({
  id: { type: Number },
  value: { type: Number, default: 1 },
  key: { type: String },
});
const fitnessSchema = new Schema(
  {
    fitness_level: [FitnessLevelSchema],
    fitness_goal: [FitnessGoalSchema],
    services_offered: [ServicesSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Fitness", fitnessSchema, "fitness");
