import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Delete the model if it exists to avoid caching issues
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

export default mongoose.model("Category", CategorySchema);

