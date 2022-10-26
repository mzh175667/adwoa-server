import mongoose from "mongoose";

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    cardNumber: {
      type: String,
      required: false,
    },
    cardExpiryDate: {
      type: String,
      required: false,
    },
    cvv: {
      type: Number,
      required: false,
    },
    transactionStatus: { type: String, required: false },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema, "transactions");
