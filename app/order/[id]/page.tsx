'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import OrderedProductDetailedView from "@/components/shared/order/OrderProductDeatiledView";
import Image from "next/image";

// Mock data since we can't access the database functions directly
const mockOrderData = {
  success: true,
  orderData: {
    _id: "6678a9b3e1b2c3d4e5f6a7b8",
    createdAt: "2023-06-15T10:30:00.000Z",
    user: {
      username: "johnsmith",
      email: "john.smith@example.com",
      address: {
        address1: "123 Main Street",
        address2: "Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
        phoneNumber: "+1 (555) 123-4567"
      }
    },
    products: [
      {
        id: "prod1",
        name: "Classic White T-Shirt",
        price: 24.99,
        qty: 2,
        size: "M",
        color: "White",
        image: "/placeholder-shirt.jpg"
      },
      {
        id: "prod2",
        name: "Slim Fit Jeans",
        price: 59.99,
        qty: 1,
        size: "32x32",
        color: "Dark Blue",
        image: "/placeholder-jeans.jpg"
      }
    ],
    total: 109.97,
    totalBeforeDiscount: 129.95,
    totalSaved: 19.98,
    paymentMethod: "stripe",
    couponApplied: "SUMMER15"
  }
};

const OrderPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Resolve the params promise
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setOrderId(resolvedParams.id);
        
        // Simulate data fetching
        setTimeout(() => {
          setOrderData(mockOrderData);
          setLoading(false);
        }, 500);
      } catch (error) {
        toast.error("Failed to load order details");
        setLoading(false);
      }
    };

    resolveParams();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData?.success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or may have been removed.</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const date = new Date(orderData.orderData.createdAt);
  const formattedDate = date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-full mx-auto bg-white shadow-md">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-4">
              <Link href="/">
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Link>
              <Link href="/">
                <span className="text-sm font-medium hover:underline">Home</span>
              </Link>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold capitalize">
                THANK YOU, {orderData.orderData.user.username}
              </h1>
              <p className="text-gray-600 mt-2">
                Order ID: {orderData.orderData._id}
              </p>
            </div>

            {/* Order Details Section */}
            <div className="mb-6 border rounded-lg overflow-hidden">
              <div className="flex flex-wrap">
                <div className="w-full sm:w-1/2 md:w-1/5 p-4 border-b sm:border-b-0 sm:border-r">
                  <div className="font-semibold text-sm mb-1">
                    ORDER NUMBER:
                  </div>
                  <div className="text-sm truncate">{orderData.orderData._id}</div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 p-4 border-b md:border-b-0 md:border-r">
                  <div className="font-semibold text-sm mb-1">DATE:</div>
                  <div>{formattedDate}</div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 p-4 sm:border-r">
                  <div className="font-semibold text-sm mb-1">EMAIL:</div>
                  <div className="truncate">
                    {orderData.orderData.user.email}
                  </div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 p-4">
                  <div className="font-semibold text-sm mb-1">TOTAL:</div>
                  <div>${orderData.orderData.total.toFixed(2)}</div>
                </div>
              </div>
              <div className="border-t p-4">
                <div className="font-semibold text-sm mb-1">
                  PAYMENT METHOD:
                </div>
                <div>
                  {orderData.orderData.paymentMethod === "cod"
                    ? "Cash on Delivery (COD)"
                    : "Stripe"}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <CheckCircle2 className="w-[50px] h-[50px] text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold">
                      Your order is confirmed
                    </h2>
                    <p className="text-gray-600">
                      Order will be delivered to you in 2-3 days at the following
                      address
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium capitalize">
                      {orderData.orderData.user.username}
                    </span>
                    <span className="text-gray-600">
                      {orderData.orderData.user.address.phoneNumber}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {orderData.orderData.user.address.address1}
                    <br />
                    {orderData.orderData.user.address.address2 &&
                      `${orderData.orderData.user.address.address2},`}
                    <br />
                    {orderData.orderData.user.address.city},
                    <br />
                    ZipCode: {orderData.orderData.user.address.zipCode},
                    <br />
                    {orderData.orderData.user.address.state},
                    <br />
                    {orderData.orderData.user.address.country}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">
                      {orderData.orderData.products.length > 1
                        ? `${orderData.orderData.products.length} Items`
                        : `${orderData.orderData.products.length} Item`}
                    </span>
                    <span className="font-medium">
                      $ {orderData.orderData.total.toFixed(2)}
                    </span>
                  </div>
                  {orderData.orderData.products.map((item: any, index: number) => (
                    <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
                          <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center text-gray-500 text-xs">
                            Image
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.size} • Qty {item.qty}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="font-medium mr-2">
                              ${item.price} * {item.qty} = $
                              {(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <OrderedProductDetailedView item={item} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                {orderData.orderData.totalSaved +
                  (orderData.orderData.totalBeforeDiscount -
                    orderData.orderData.total) >
                  0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-6 h-6 text-green-500 mr-2" />
                      <span className="text-green-700">
                        Yay! You have saved $
                        {(
                          orderData.orderData.totalSaved +
                          (orderData.orderData.totalBeforeDiscount -
                            orderData.orderData.total)
                        ).toFixed(2)}{" "}
                        on this total order.
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-gray-100 rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4">Bill Details</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total MRP</span>
                      <span>
                        $
                        {(
                          orderData.orderData.totalBeforeDiscount +
                          orderData.orderData.totalSaved
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Product Discount</span>
                      <span>- ${orderData.orderData.totalSaved.toFixed(2)}</span>
                    </div>
                    {orderData.orderData.totalBeforeDiscount -
                      orderData.orderData.total >
                      0 && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          Coupon Discount ({orderData.orderData.couponApplied})
                        </span>
                        <span>
                          - $
                          {(
                            orderData.orderData.totalBeforeDiscount -
                            orderData.orderData.total
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between font-semibold pt-2 border-t border-gray-300">
                      <span>Subtotal</span>
                      <span>${orderData.orderData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Link href="/">
                  <Button className="w-full mt-6 py-6 text-lg bg-blue-600 hover:bg-blue-700">
                    CONTINUE SHOPPING
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;