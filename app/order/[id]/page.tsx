"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getOrderDetailsById } from "@/lib/database/actions/order.actions";
import Image from "next/image";

// Define expected response type
interface IOrderProduct {
  product: string;
  name: string;
  vendor: object;
  image: string;
  size: string;
  qty: number;
  color: {
    color: string;
    image: string;
  };
  price: number;
  status: string;
  productCompletedAt?: Date | null;
}

interface IOrder {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  products: IOrderProduct[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  total: number;
  shippingPrice: number;
  taxPrice: number;
  isPaid: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface IOrderResponse {
  success: boolean;
  message?: string;
  orderData: IOrder | null;
}

const OrderPage = ({ id }: { id: string }) => {
  const [orderData, setOrderData] = useState<IOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await getOrderDetailsById(id);
        setOrderData(response);
      } catch (err) {
        toast.error(String(err));
        setOrderData({
          success: false,
          message: String(err),
          orderData: null,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (!orderData?.success || !orderData.orderData) {
    return <p className="text-red-500">❌ Order not found or invalid ID.</p>;
  }

  const order = orderData.orderData;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Order Details (#{order._id})
      </h1>

      <div className="mb-4">
        <h2 className="font-semibold">Customer</h2>
        <p>{order.user.name} ({order.user.email})</p>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Shipping Address</h2>
        <p>
          {order.shippingAddress.firstName} {order.shippingAddress.lastName} <br />
          {order.shippingAddress.address1}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
          {order.shippingAddress.zipCode}, {order.shippingAddress.country}
        </p>
        <p>Phone: {order.shippingAddress.phoneNumber}</p>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Products</h2>
        <ul>
          {order.products.map((item, idx) => (
            <li key={idx} className="border-b py-2 flex items-center">
              <Image
  src={item.image}
  alt={item.name}
  width={64}   // w-16
  height={64}  // h-16
  className="object-cover rounded mr-4"
/>
              <div>
                <p className="font-medium">{item.name}</p>
                <p>
                  Qty: {item.qty} | Price: ${item.price}
                </p>
                <p>Status: {item.status}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold">Payment</h2>
        <p>Method: {order.paymentMethod}</p>
        <p>Total: ${order.total.toFixed(2)}</p>
        <p>Shipping: ${order.shippingPrice.toFixed(2)}</p>
        <p>Tax: ${order.taxPrice.toFixed(2)}</p>
        <p className={order.isPaid ? "text-green-600" : "text-red-600"}>
          {order.isPaid ? `Paid at ${order.paidAt}` : "Not Paid"}
        </p>
      </div>
    </div>
  );
};

export default OrderPage;
