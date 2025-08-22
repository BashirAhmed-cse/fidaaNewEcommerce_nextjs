import mongoose, { Schema, model, models, Document, Types, Model } from "mongoose";

// Interface
export interface ISubCategory extends Document {
  name: string;
  slug?: string;
  images?: { url?: string; public_url?: string }[];
  vendor?: object;
  parent: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema
const subCategorySchema = new Schema<ISubCategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, lowercase: true, index: true },
    images: [{ url: String, public_url: String }],
    vendor: { type: Object },
    parent: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

// Typed model
const SubCategory: Model<ISubCategory> =
  models.SubCategory || model<ISubCategory>("SubCategory", subCategorySchema);

export default SubCategory;
