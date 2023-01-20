import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

const reviewsSchema = new Schema(
  {
    review: { type: String, required: true },
    rate: { type: Number, required: true, min: 1, max: 5, default: 1 },
  },
  { timestamps: true }
);

export default model("Review", reviewsSchema);
