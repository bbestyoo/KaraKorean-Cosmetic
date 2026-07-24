'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Lock, Mail, MapPin, CreditCard, Truck } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface DeliveryFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  shippingAddress: string;
  city: string;
  country: string;
  createAccount: boolean;
  password: string;
}

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  shippingAddress?: string;
  transactionId?: string;
}

interface CouponResult {
  status: string;
  amount?: string;
  percentage?: string;
  code?: string;
}

type ShippingTier = 'kathmandu_pokhara' | 'tier2' | 'tier3' | 'remote';

const SHIPPING_METHODS: { id: ShippingTier; label: string; description: string; price: number }[] = [
  { id: 'kathmandu_pokhara', label: 'Home Delivery — Kathmandu & Pokhara Valley', description: 'Standard delivery within valley', price: 99 },
  { id: 'tier2', label: 'Home Delivery — Tier 2 Cities', description: 'Delivery to major cities', price: 135 },
  { id: 'tier3', label: 'Home Delivery — Tier 3 Cities', description: 'Delivery to smaller cities', price: 160 },
  { id: 'remote', label: 'Delivery — Remote Areas', description: 'Delivery to remote areas', price: 220 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { isLoggedIn, user, token, fetchWithAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'qr'>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [shippingTier, setShippingTier] = useState<ShippingTier>('kathmandu_pokhara');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [formData, setFormData] = useState<DeliveryFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    shippingAddress: '',
    city: '',
    country: '',
    createAccount: false,
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const API_BASE_URL = (() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    return base.replace(/\/shop\/?$/, '');
  })();

  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchUserInfo = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/userauth/api/info/`);
        if (res.ok) {
          const data = await res.json();
          const nameParts = (data.name || data.username || '').split(' ');
          setFormData(prev => ({
            ...prev,
            fullName: nameParts[0] || prev.fullName,
            email: data.email || prev.email,
            phoneNumber: data.phone || data.phone_number || prev.phoneNumber,
            shippingAddress: data.address || data.shipping_address || prev.shippingAddress,
            city: data.city || prev.city,
            country: data.country || prev.country,
          }));
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchUserInfo();
  }, [isLoggedIn, token]);

  // Coupon apply handler
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError('');
    setCouponResult(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/cart/api/coupon/?code=${couponCode.trim()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.status === 'Success') {
        setCouponResult({ ...data, code: couponCode.trim() });
      } else {
        setCouponError(data.detail || data.message || 'Invalid or expired coupon.');
      }
    } catch {
      setCouponError('Failed to apply coupon. Try again.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const subtotal = getTotalPrice();
  const shippingCost = SHIPPING_METHODS.find(m => m.id === shippingTier)?.price ?? 99;

  // Compute discount from coupon
  const discountAmount = (() => {
    if (!couponResult) return 0;
    if (couponResult.percentage) {
      const percentage = parseFloat(couponResult.percentage);
      return isNaN(percentage) ? 0 : Math.round(subtotal * percentage / 100);
    }
    if (couponResult.amount) {
      const amt = parseFloat(couponResult.amount);
      return isNaN(amt) ? 0 : amt;
    }
    return 0;
  })();

  const total = subtotal + shippingCost - discountAmount;

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'First name is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = 'Address is required';
    }
    if (paymentMethod === 'qr' && !transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required for QR payment';
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
      const orderPayload = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        shippingAddress: formData.shippingAddress,
        subtotal: subtotal - discountAmount,
        shippingCost,
        shippingMethod: SHIPPING_METHODS.find(m => m.id === shippingTier)?.label ?? '',
        discountAmount,
        total,
        couponCode: couponResult ? couponResult.code : undefined,
        paymentMethod,
        transactionId: paymentMethod === 'qr' ? transactionId : undefined,
        cartItems: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
        })),
      };

      // Debug: confirm the discounted values being sent
      console.log('📦 Order payload:', orderPayload);
      console.log(`💰 subtotal=${subtotal}, discount=${discountAmount}, total=${total}, coupon=${couponResult?.code}`);

      const response = await fetchWithAuth(`${API_BASE_URL}/cart/api/checkout/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ fullName: errorData.detail || 'Order creation failed' });
        return;
      }

      const orderData = await response.json();

      // Clear cart
      clearCart();

      // Redirect to success page
      router.push(`/order-confirmation/${orderData.id}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrors({ fullName: 'Failed to submit order. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        {/* <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors mb-6"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">Checkout</h1>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Sign In Prompt */}
              {!isLoggedIn && (
                <div className="bg-[#0f3b2b]/10 border border-blue-200 rounded-lg p-6">
                  <div className="flex gap-3 items-start">
                    <Mail size={20} className="text-[#0f3b2b] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Already have an account?</h3>
                      <p className="text-sm text-gray-600 mb-4">Sign in to use saved addresses and track your orders.</p>
                      <button
                        onClick={() => router.push('/login')}
                        className="px-4 py-2  text-white rounded font-semibold bg-[#0f3b2b] hover:bg-white hover:text-[#0f3b2b] cursor-pointer hover:border hover:border-[#0f3b2b] border border-black transition-colors"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter full name"
                        value={formData?.fullName}
                        onChange={(e) => {
                          handleInputChange(e);
                          setErrors(prev => ({ ...prev, fullName: '' }));
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
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
                        value={formData?.phoneNumber}
                        onChange={(e) => {
                          handleInputChange(e);
                          setErrors(prev => ({ ...prev, phoneNumber: '' }));
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
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
                        value={formData?.email}
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
                      value={formData?.shippingAddress}
                      onChange={(e) => {
                        handleInputChange(e);
                        setErrors(prev => ({ ...prev, shippingAddress: '' }));
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.shippingAddress ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.shippingAddress && <p className="text-red-500 text-xs mt-1">{errors.shippingAddress}</p>}
                  </div>

                  {/* City and Country */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        value={formData?.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        placeholder="Enter country"
                        value={formData?.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck size={20} className="text-red-500" />
                  Shipping Method
                </h2>

                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setShippingTier(method.id)}
                      className={`bg-white border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        shippingTier === method.id
                          ? 'border-[#0f3b2b] ring-1 ring-[#0f3b2b]/20'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center h-6">
                          <input
                            type="radio"
                            id={`shipping-${method.id}`}
                            name="shippingMethod"
                            checked={shippingTier === method.id}
                            onChange={() => setShippingTier(method.id)}
                            className="w-4 h-4 accent-[#0f3b2b] cursor-pointer"
                          />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <label htmlFor={`shipping-${method.id}`} className="font-semibold text-gray-900 cursor-pointer">
                              {method.label}
                            </label>
                            <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                          </div>
                          <span className="font-bold text-gray-900 ml-4">Rs {method.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-red-500" />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`bg-white border rounded-lg p-4 cursor-pointer transition-all duration-200 ${paymentMethod === 'cod'
                      ? 'border-[#0f3b2b] ring-1 ring-[#0f3b2b]/20'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center h-6">
                        <input
                          type="radio"
                          id="cod"
                          name="paymentMethod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-4 h-4 accent-[#0f3b2b] cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="cod" className="font-semibold text-gray-900 cursor-pointer">
                          Cash on Delivery
                        </label>
                        <p className="text-sm text-gray-600 mt-1">Pay when you receive your order</p>
                      </div>
                    </div>
                  </div>

                  {/* Pay via QR Code */}
                  <div
                    onClick={() => setPaymentMethod('qr')}
                    className={`bg-white border rounded-lg p-4 cursor-pointer transition-all duration-200 ${paymentMethod === 'qr'
                      ? 'border-[#0f3b2b] ring-1 ring-[#0f3b2b]/20'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center h-6">
                        <input
                          type="radio"
                          id="qr"
                          name="paymentMethod"
                          checked={paymentMethod === 'qr'}
                          onChange={() => setPaymentMethod('qr')}
                          className="w-4 h-4 accent-[#0f3b2b] cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="qr" className="font-semibold text-gray-900 cursor-pointer">
                          Pay via QR Code
                        </label>
                        <p className="text-sm text-gray-600 mt-1">Scan and pay using your banking app</p>
                      </div>
                    </div>

                    {/* QR Expanded Section */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${paymentMethod === 'qr' ? 'max-h-[700px] opacity-100 mt-5' : 'max-h-0 opacity-0'
                        }`}
                    >
                      <div className="border-t border-gray-200 pt-5">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Scan the QR code and complete your payment. You can also contact us via
                          Instagram or Whatsapp or Viber at{' '}
                          <span className="font-semibold text-gray-900">+977-9849900249 </span> /{' '}
                          <span className="font-semibold text-gray-900">+977-9851413678</span>
                        </p>

                        {/* QR Code Image */}
                        <div className="flex justify-center my-5">
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                            <Image
                              src="/images/payment-qr.jpg"
                              alt="Kara Korean Store - Prabhu Bank QR Code"
                              width={240}
                              height={320}
                              className="object-contain rounded"
                            />
                          </div>
                        </div>

                        {/* Transaction ID Input */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Transaction ID <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => { setTransactionId(e.target.value); setErrors(prev => ({ ...prev, transactionId: '' })); }}
                            placeholder="Enter Transaction ID"
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3b2b]/40 focus:border-[#0f3b2b] transition-colors ${errors.transactionId ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {errors.transactionId && <p className="text-red-500 text-xs mt-1">{errors.transactionId}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Account */}
              {!isLoggedIn && (
                <div className="pt-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="createAccount"
                      name="createAccount"
                      checked={formData?.createAccount}
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
                        value={formData?.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={handleContinueToPayment}
                disabled={isLoading}
                className="w-full  text-white py-4 rounded-lg font-bold text-lg bg-[#0f3b2b] hover:bg-white hover:text-[#0f3b2b] cursor-pointer hover:border hover:border-[#0f3b2b] border border-black  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div key={`${item.product_id}-${item.size}`} className="flex gap-4">
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
                        {item.size} | Qty: {item.quantity}
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
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); setCouponResult(null); }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3b2b]/40"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon}
                    className="px-4 py-2 text-white rounded border border-black font-semibold bg-[#0f3b2b] hover:bg-white hover:text-[#0f3b2b] cursor-pointer hover:border-[#0f3b2b] disabled:opacity-60"
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
                {couponResult && (
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    ✓ Coupon <span className="font-bold">{couponResult.code}</span> applied —{' '}
                    {couponResult.percentage
                      ? `${couponResult.percentage}% off`
                      : `NPR ${parseFloat(couponResult.amount || '0').toLocaleString()} off`}
                  </p>
                )}
                {!couponResult && !couponError && (
                  <p className="text-xs text-gray-500 mt-2">
                    <span className="text-red-500">*</span> Apply Promotion Code
                  </p>
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>NPR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>NPR {shippingCost}</span>
                </div>
                {couponResult && discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>
                      Discount{couponResult.percentage ? ` (${couponResult.percentage})` : ''}
                    </span>
                    <span>- NPR {discountAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-6 pb-6 border-b border-gray-200">
                <span>Total</span>
                <span className="text-green-500">NPR {total.toLocaleString()}</span>
              </div>

              {/* Place Order Button */}

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