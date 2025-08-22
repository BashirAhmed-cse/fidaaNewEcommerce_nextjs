import { Schema, model, models, Document, Model } from "mongoose";


export interface IUserAddress {
  _id?: string; // add optional _id
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  active?: boolean;
}

// 1. Define TypeScript interface
export interface IUser extends Document {
  clerkId: string;
  email: string;
  image: string;
  username: string;
  role: string;
  defaultPaymentMethod: string;
  address?: IUserAddress[];
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define schema
// 2. Define schema
const UserSchema: Schema<IUser> = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: String, default: "user" },
    defaultPaymentMethod: { type: String, default: "" },
    address: [
      {
        firstName: String,
        lastName: String,
        phoneNumber: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        active: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);


// 3. Create model with interface
const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);

export default User;
