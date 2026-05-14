'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Lock, Mail, MapPin, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface DeliveryFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  shippingAddress: string;
  createAccount: boolean;
  password: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  shippingAddress?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<DeliveryFormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    shippingAddress: '',
    createAccount: false,
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const subtotal = getTotalPrice();
  const shippingCost = subtotal > 5000 ? 0 : 120;
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleContinueToPayment = async () => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = 'Address is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (formData.createAccount && !formData.password) {
      setErrors(prev => ({
        ...prev,
        password: 'Please create a password to create an account'
      }));
      return;
    }

    // Submit order to backend
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/cart/api/checkout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          shippingAddress: formData.shippingAddress,
          subtotal,
          shippingCost,
          cartItems: items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ firstName: errorData.detail || 'Order creation failed' });
        return;
      }

      const orderData = await response.json();
      
      // Clear cart
      clearCart();
      
      // Redirect to success page
      router.push(`/order-confirmation/${orderData.id}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrors({ firstName: 'Failed to submit order. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors mb-6"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
                {/* Sign In Prompt */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex gap-3 items-start">
                    <Mail size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Already have an account?</h3>
                      <p className="text-sm text-gray-600 mb-4">Sign in to use saved addresses and track your orders.</p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors">
                        Sign In
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Mail size={20} className="text-red-500" />
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={(e) => {
                            handleInputChange(e);
                            setErrors(prev => ({ ...prev, firstName: '' }));
                          }}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={(e) => {
                            handleInputChange(e);
                            setErrors(prev => ({ ...prev, lastName: '' }));
                          }}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                <div className='grid grid-cols-2 gap-4'>
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Enter phone number"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                          handleInputChange(e);
                          setErrors(prev => ({ ...prev, phoneNumber: '' }));
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email (optional)"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin size={20} className="text-red-500" />
                    Shipping Address
                  </h2>

                  <div className="space-y-4">
                    {/* Street Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="shippingAddress"
                        placeholder="Enter street address"
                        value={formData.shippingAddress}
                        onChange={(e) => {
                          handleInputChange(e);
                          setErrors(prev => ({ ...prev, shippingAddress: '' }));
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.shippingAddress ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.shippingAddress && <p className="text-red-500 text-xs mt-1">{errors.shippingAddress}</p>}
                    </div>

                    {/* City and Area */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">City</label>
                        <input
                          type="text"
                          placeholder="Enter city"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                    {/* ZIP Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        placeholder="Enter ZIP code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>
                        </div>
                  </div>
                </div>

                {/* Payment Method - COD Only */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-red-500" />
                    Payment Method
                  </h2>

                  <div className="bg-white border border-gray-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center h-6">
                        <input
                          type="radio"
                          id="cod"
                          checked={true}
                          disabled
                          className="w-4 h-4 cursor-default"
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="cod" className="font-semibold text-gray-900 cursor-default">
                          Cash on Delivery
                        </label>
                        <p className="text-sm text-gray-600 mt-1">Pay when you receive your order</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Create Account */}
                <div className="pt-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="createAccount"
                      name="createAccount"
                      checked={formData.createAccount}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                    <label htmlFor="createAccount" className="text-sm text-gray-900 cursor-pointer">
                      Create an account
                    </label>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Save your information for faster checkout next time</p>

                  {/* Password Field (if creating account) */}
                  {formData.createAccount && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinueToPayment}
                  disabled={isLoading}
                  className="w-full bg-red-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : `Place Order - NPR ${total.toLocaleString()}`}
                </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="h-fit">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {items.map((item) => (
                  <div key={`${item.product_id}-${item.size}-${item.color}`} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.size} | {item.color} | Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-2">NPR {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button className="px-4 py-2 bg-purple-500 text-white rounded font-semibold hover:bg-purple-600 transition-colors">
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="text-red-500">*</span> Apply Promotion Code
                </p>
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>NPR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `NPR ${shippingCost}`}</span>
                </div>
                {subtotal > 0 && subtotal <= 5000 && (
                  <p className="text-xs text-gray-500 mt-2">Free delivery on orders above NPR 5000</p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-6 pb-6 border-b border-gray-200">
                <span>Total</span>
                <span className="text-green-500">NPR {total.toLocaleString()}</span>
              </div>

              {/* Place Order Button */}
              <button
                className="w-full bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors"
              >
                Place Order - NPR {total.toLocaleString()}
              </button>

              {/* Security Message */}
              <p className="text-xs text-gray-600 mt-4 flex items-center gap-2 text-center">
                <Lock size={14} />
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
