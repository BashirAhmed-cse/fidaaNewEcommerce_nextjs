import mongoose, { Schema, model, models, Document, Model, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  images: { url: string; public_id: string }[];
  slug: string;
  vendor?: object;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, unique: true, required: true },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    slug: { type: String, unique: true, lowercase: true, index: true },
    vendor: { type: Object },
  },
  { timestamps: true }
);

// ✅ Strongly typed export
const Category: Model<ICategory> =
  models.Category || model<ICategory>("Category", categorySchema);

export default Category;
