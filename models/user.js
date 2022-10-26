import mongoose from "mongoose";

const Schema = mongoose.Schema;
// const FitnessGoalSchema = mongoose.Schema({
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Fitness.fitness_goal",
// });
// const ServicesSchema = mongoose.Schema({
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Fitness.services_offered",
// });
// const FitnessLevelSchema = mongoose.Schema({
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Fitness.fitness_level",
// });
const FitnessLevelSchema = mongoose.Schema({
  value: { type: String },
  key: { type: String },
});
const userSchema = new Schema(
  {
    email: { type: String },
    password: { type: String },
    role: { type: String, default: "trainee" },
    fitness_level: {
      value: { type: Number },
      key: { type: String },
    },
    fitness_goal: {
      value: { type: String },
      key: { type: String },
    },
    // services_offered: [FitnessLevelSchema],
    isVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    reset_password: { type: Boolean, default: false },
    trainerVerified: { type: String, default: "pending" },
    accountVerified: { type: String, default: "pending" }, //  suspend || active || deleted
    numReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema, "users");
