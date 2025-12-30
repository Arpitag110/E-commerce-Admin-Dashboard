import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // slug used for URLs and uniqueness
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
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

// generate slug from name before validation/save
CategorySchema.pre("validate", function () {
  if (this.name && (!this.slug || this.isModified("name"))) {
    const slug = this.name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    this.slug = slug || undefined;
  }
});

export default mongoose.model("Category", CategorySchema);

