import mongoose, { Schema, model, models, Document, Types } from "mongoose";

// TypeScript interfaces
export interface ICartProduct {
  product: Types.ObjectId | string;
  name: string;
  vendor: any;
  image: string;
  size: string;
  qty: string;
  color: { color: string; image: string };
  price: number;
}

export interface ICart extends Document {
  products: ICartProduct[];
  cartTotal: number;
  totalAfterDiscount?: number;
  user: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Schema
const cartSchema = new Schema<ICart>(
  {
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        vendor: { type: Object, default: {} },
        image: { type: String, default: "" },
        size: { type: String, required: true },
        qty: { type: String, required: true },
        color: { color: String, image: String },
        price: { type: Number, required: true },
      },
    ],
    cartTotal: { type: Number, required: true },
    totalAfterDiscount: { type: Number, default: 0 },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Export typed model
const Cart = models.Cart || model<ICart>("Cart", cartSchema);
export default Cart;
