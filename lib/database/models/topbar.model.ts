import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Interface
export interface ITopBar extends Document {
  title: string;
  link?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema
const topBarSchema = new Schema<ITopBar>(
  {
    title: { type: String, required: true },
    link: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Typed model
const TopBar: Model<ITopBar> =
  models.TopBar || model<ITopBar>("TopBar", topBarSchema);

export default TopBar;
