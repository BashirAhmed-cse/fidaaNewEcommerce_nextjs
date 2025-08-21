"use server";

import { handleError } from "@/lib/utils";
import { connectToDatabase } from "../connect";
import Product from "../models/product.model";
import User from "../models/user.model";
import Cart, { ICart } from "../models/cart.model";

// Cart operations for user:
export async function saveCartForUser(cart: any, clerkId: string) {
  try {

    // Validate inputs
    if (!clerkId || typeof clerkId !== "string") {
      throw new Error("Invalid or missing clerkId");
    }
    if (!Array.isArray(cart)) {
      throw new Error("Cart must be an array");
    }

    await connectToDatabase();

    let products: any[] = [];

    const user = await User.findOne({ clerkId });
    if (!user) throw new Error(`User with clerkId ${clerkId} not found`);

    await Cart.deleteOne({ user: user._id });

    for (let i = 0; i < cart.length; i++) {
      const cartItem = cart[i];
      const dbProduct: any = await Product.findById(cartItem._id).lean();
      if (!dbProduct) throw new Error(`Product with ID ${cartItem._id} not found`);

      const subProduct = dbProduct.subProducts?.[cartItem.style];
      if (!subProduct) {
        throw new Error(
          `SubProduct style index ${cartItem.style} not found for product ${dbProduct.name}`
        );
      }

      const sizeObj = subProduct.sizes?.find((p: any) => p.size == cartItem.size);
      if (!sizeObj) {
        throw new Error(
          `Size "${cartItem.size}" not found in product "${dbProduct.name}" (style index ${cartItem.style})`
        );
      }

      const price = Number(sizeObj.price);
      const finalPrice =
        subProduct.discount > 0
          ? +(price - (price * Number(subProduct.discount)) / 100).toFixed(2)
          : +price.toFixed(2);

      const tempProduct: any = {
        name: dbProduct.name,
        product: dbProduct._id,
        color: {
          color: cartItem.color?.color || "",
          image: cartItem.color?.image || "",
        },
        image: subProduct.images?.[0]?.url || "",
        qty: Number(cartItem.qty),
        size: cartItem.size,
        vendor: cartItem.vendor || {},
        vendorId: cartItem.vendor?._id || "",
        price: finalPrice,
      };

      products.push(tempProduct);
    }

    const cartTotal = products.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );

    await new Cart({
      products,
      cartTotal: cartTotal.toFixed(2),
      user: user._id,
    }).save();

    return { success: true };
  } catch (error: any) {
  console.error("saveCartForUser error:", {
    message: error.message,
    stack: error.stack,
    clerkId,
    cart,
  });
  handleError(error);
  return { success: false, message: error.message || "Failed to save cart." };
}
}


export async function getSavedCartForUser(clerkId: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId });
 const cart: ICart | null = await Cart.findOne({ user: user._id }).lean();
    return {
      user: JSON.parse(JSON.stringify(user)),
      cart: JSON.parse(JSON.stringify(cart)),
      address: JSON.parse(JSON.stringify(user.address)),
    };
  } catch (error) {
    handleError(error);
  }
}

// update cart for user
export async function updateCartForUser(products: any[]) {
  try {
    await connectToDatabase();

    const updatedProducts = await Promise.all(
      products.map(async (p: any) => {
        const dbProduct: any = await Product.findById(p._id).lean();
        if (!dbProduct) {
          throw new Error(`Product with ID ${p._id} not found.`);
        }

        const subProduct = dbProduct.subProducts?.[p.style];
        if (!subProduct) {
          throw new Error(
            `SubProduct style index ${p.style} not found for product "${dbProduct.name}".`
          );
        }

        const sizeObj = subProduct.sizes?.find((x: any) => x.size == p.size);
        if (!sizeObj) {
          throw new Error(
            `Size "${p.size}" not found in product "${dbProduct.name}" (style index ${p.style}).`
          );
        }

        const originalPrice = Number(sizeObj.price);
        const quantity = Number(sizeObj.qty);
        const discount = Number(subProduct.discount);

        const discountedPrice =
          discount > 0
            ? +(originalPrice - (originalPrice * discount) / 100).toFixed(2)
            : +originalPrice.toFixed(2);

        return {
          ...p,
          priceBefore: originalPrice,
          price: discountedPrice,
          discount,
          quantity,
          shippingFee: dbProduct.shipping || 0,
        };
      })
    );

    return {
      success: true,
      message: "Successfully updated the cart.",
      data: JSON.parse(JSON.stringify(updatedProducts)),
    };
  } catch (error: any) {
    console.error("updateCartForUser error:", error.message);
    handleError(error);
    return {
      success: false,
      message: error.message || "Failed to update cart.",
    };
  }
}

