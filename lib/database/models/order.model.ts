import mongoose, { Document, Schema, Model } from "mongoose";

const { ObjectId } = Schema;

// 1. Define TS interface
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  products: {
    product: mongoose.Types.ObjectId;
    name?: string;
    vendor?: object;
    image?: string;
    size?: string;
    qty?: number;
    color?: {
      color: string;
      image: string;
    };
    price?: number;
    status?: string;
    productCompletedAt?: Date | null;
  }[];
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  paymentMethod?: string;
  paymentResult?: {
    id?: string;
    status?: string;
    email?: string;
  };
  total: number;
  totalBeforeDiscount?: number;
  couponApplied?: string;
  shippingPrice: number;
  taxPrice?: number;
  isPaid: boolean;
  totalSaved?: number;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  paidAt?: Date;
  deliveredAt?: Date;
  isNew?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define Schema
const orderSchema = new Schema<IOrder>(
  {
    user: { type: ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: ObjectId, ref: "Product" },
        name: String,
        vendor: Object,
        image: String,
        size: String,
        qty: Number,
        color: {
          color: String,
          image: String,
        },
        price: Number,
        status: { type: String, default: "Not Processed" },
        productCompletedAt: { type: Date, default: null },
      },
    ],
    shippingAddress: {
      firstName: String,
      lastName: String,
      phoneNumber: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    paymentMethod: String,
    paymentResult: {
      id: String,
      status: String,
      email: String,
    },
    total: { type: Number, required: true },
    totalBeforeDiscount: Number,
    couponApplied: String,
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, default: 0 },
    isPaid: { type: Boolean, required: true, default: false },
    totalSaved: Number,
    razorpay_order_id: String,
    razorpay_payment_id: String,
    paidAt: Date,
    deliveredAt: Date,
    isNew: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 3. Export typed model
const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
