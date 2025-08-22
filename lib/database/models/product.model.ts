import mongoose, { Schema, model, models, Document, Types, Model } from "mongoose";

// Sub-schema for reviews
const reviewSchema = new Schema(
  {
    reviewBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, default: 0 },
    review: { type: String, required: true },
    reviewCreatedAt: { type: Date, required: true },
    verified: { type: Boolean, default: false, required: true },
  },
{ _id: true }
);

// Interface for Product
export interface IProduct extends Document {
  name: string;
  description: string;
  longDescription?: string;
  brand?: string;
  slug: string;
  category: Types.ObjectId;
  subCategories: Types.ObjectId[];
  details: { name: string; value: string }[];
  benefits: { name: string }[];
  ingredients: { name: string }[];
  reviews: {
    reviewBy: Types.ObjectId;
    rating: number;
    review: string;
    reviewCreatedAt: Date;
    verified: boolean;
  }[];
  rating: number;
  numReviews: number;
  vendor?: object;
  subProducts: {
    sku: string;
    images: { url: string }[];
    description_images: { url: string }[];
    color: { color: string; image: string };
    sizes: { size: string; qty: number; price: number; sold: number }[];
    discount: number;
    sold: number;
  }[];
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    brand: { type: String },
    slug: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategories: [{ type: Schema.Types.ObjectId, ref: "subCategory" }],
    details: [{ name: String, value: String }],
    benefits: [{ name: String }],
    ingredients: [{ name: String }],
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    vendor: { type: Object },
    subProducts: [
      {
        sku: String,
        images: [{ url: String }],
        description_images: [{ url: String }],
        color: { color: String, image: String },
        sizes: [
          {
            size: String,
            qty: Number,
            price: Number,
            sold: { type: Number, default: 0 },
          },
        ],
        discount: { type: Number, default: 0 },
        sold: { type: Number, default: 0 },
      },
    ],
    featured: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

// ✅ Strongly typed export
const Product: Model<IProduct> =
  models.Product || model<IProduct>("Product", productSchema);

export default Product;
