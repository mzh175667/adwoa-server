const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const SessionTypeSchema = mongoose.Schema({
  type: { type: String },
  // online: {
  meetingLink: { type: String },
  // },
  // physical: {
  lat: { type: Number },
  lng: { type: Number },
  distance: { type: Number },
  // },

  videoLink: { type: String },
  recordCategory: { type: String },
  videoTitle: { type: String },
  no_of_play: { type: String },
  desc: { type: String },
});

const EquipmentSchema = mongoose.Schema({
  value: { type: String },
});
const sessionSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    session_title: { type: String },
    class_title: { type: String },
    select_date: {
      type: String,
    },
    class_time: {
      type: String,
    },
    duration: {
      type: Number,
    },
    equipment: [EquipmentSchema],
    session_type: SessionTypeSchema, // online || pysical || recorded
    sports: {
      type: String,
    },

    category: {
      type: String,
    },
    details: {
      type: String,
    },
    price: {
      type: Number,
    },
    no_of_slots: {
      type: Number,
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema, "sessions");
