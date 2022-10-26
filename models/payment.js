const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cus_id: {
      type: String,
      required: false,
    },
    card_id: {
      type: String,
      required: false,
    },
    account_id: {
      type: String,
      required: false,
    },
    tok_card: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema, "payments");
