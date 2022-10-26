const mongoose = require("mongoose");
import { APP_URL } from "../config";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
    categoryImage: {
      type: String,
      required: true,
      get: (image) => {
        return `${APP_URL}/${image}`;
      },
    },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model("Category", categorySchema, "categories");
