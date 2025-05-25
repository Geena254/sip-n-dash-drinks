import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LocationPicker from '@/components/LocationPicker';
import { ShoppingBag, CreditCard, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { createOrder } from '@/service/apiService';
import { useLocation } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    latitude: 0,
    longitude: 0,
    payment_method: '',
    deliveryArea: ''
  });

  const deliveryAreas = [
    { name: 'Mnarani', price: 150 },
    { name: 'Bofa', price: 200 },
    { name: 'Tezo', price: 250 },
    { name: 'Mtondia', price: 300 },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    mpesaNumber: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const { state } = useLocation();
  const { orderNumber, deliveryTime, orderDate } = state || {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      address,
      latitude: lat,
      longitude: lng
    }));
  };

  const selectedArea = deliveryAreas.find(area => area.name === formData.deliveryArea);
  const deliveryFee = selectedArea ? selectedArea.price : 0;
  const tax = cartTotal * 0.05;
  const total = cartTotal + deliveryFee + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const phoneRegex = /^07\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(formData.phone)) {
      toast({ title: "Invalid phone number", description: "Use format: 07XXXXXXXX", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    const requiredFields = ['name', 'email', 'phone', 'address'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (emptyFields.length > 0) {
      toast({
        title: "Please fill in all fields",
        description: `Missing: ${emptyFields.join(', ')}`,
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (!selectedPayment) {
      toast({
        title: "Select a payment method",
        description: "Please choose how you'd like to pay.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    console.log(formData);
    try {
      // Create order summary object
      const orderSummary = {
        subtotal: cartTotal,
        deliveryFee,
        tax,
        total,
        deliveryArea: formData.deliveryArea,
        payment_method: selectedPayment,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          itemTotal: item.price * item.quantity
        }))
      };

      const orderData = {
        customer: {
          county: formData.address,
          name: formData.name,
          latitude: formData.latitude,
          longitude: formData.longitude,
          email: formData.email,
          phone: formData.phone,
          delivery_area: formData.deliveryArea,
        },
        products: items.reduce((acc, item) => {
          acc[item.name] = {
            quantity: item.quantity
          };
          return acc;
        }, {}),
        status: 'initiated',
        order_total: Math.round(orderSummary.total),
        payment_method: selectedPayment
       }

      const res = await createOrder(orderData);
      const data = res;
      navigate('/confirmation', {
        state: {
          orderNumber: data.order_id,
          deliveryTime: '30-45 minutes',
          orderDate: data.date
        }
      });
    } catch (err: any) {
      toast({
        title: "Order failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Complete Your Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <span>Delivery Information</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="transition-all focus-within:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="transition-all focus-within:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="transition-all focus-within:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Location</Label>
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialAddress={formData.address}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="flex gap-4">
                    {[
                      { type: 'mpesa', label: 'MPESA', icon: '/icons/mpesa.png' },
                      { type: 'card', label: 'Card', icon: '/icons/card.png' },
                      { type: 'cash', label: 'Cash', icon: '/icons/cash.png' },
                    ].map(({ type, label, icon }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSelectedPayment(type);
                          if (type !== 'cash') setShowPaymentModal(true);
                        }}
                        className={`p-3 border rounded-lg flex flex-col items-center justify-center w-24 transition-all ${
                          selectedPayment === type ? 'border-primary bg-primary/10' : 'border-gray-200'
                        }`}
                      >
                        <img src={icon} alt={label} className="w-6 h-6 mb-1" />
                        <span className="text-sm">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all text-white font-medium py-3 h-auto"
                    disabled={isSubmitting || items.length === 0}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                    ) : (
                      <><CreditCard className="mr-2 h-5 w-5" /> Place Order Now</>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-4">
                {items.length > 0 ? (
                  items.map(item => (
                    <div key={item.id} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                          {item.quantity}
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-medium">
                        ${(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    Your cart is empty
                  </div>
                )}
              </div>

              <div className="border-t mt-6 pt-4 space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium">KES {cartTotal.toLocaleString('en-KE')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span className="font-medium">KES {deliveryFee.toLocaleString('en-KE')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span className="font-medium">KES {tax.toLocaleString('en-KE')}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">KES {total.toLocaleString('en-KE')}</span>
                </div>
              </div>
              <div className="border-t mt-6 pt-4 space-y-3">
              <Label htmlFor="deliveryArea">Select Delivery Area</Label>
                <select
                  id="deliveryArea"
                  name="deliveryArea"
                  value={formData.deliveryArea}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select area...</option>
                  {deliveryAreas.map(area => (
                    <option key={area.name} value={area.name}>
                      {area.name} - KES {area.price.toLocaleString('en-KE')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-6 bg-primary/5 p-4 rounded-md">
                <p className="text-sm font-medium text-primary">Estimated Delivery Time</p>
                <p className="text-sm text-muted-foreground">20-45 minutes from order time</p>
                <p className="text-muted-foreground">Order date: <strong>{new Date(orderDate).toLocaleString('en-KE')}</strong></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">Enter {selectedPayment === 'mpesa' ? 'MPESA' : 'Card'} Details</h2>
            {selectedPayment === 'mpesa' && (
              <div className="space-y-2">
                <Label htmlFor="mpesaNumber">MPESA Number</Label>
                <Input
                  id="mpesaNumber"
                  name="mpesaNumber"
                  placeholder="07XXXXXXXX"
                  value={paymentDetails.mpesaNumber}
                  onChange={e => setPaymentDetails(prev => ({ ...prev, mpesaNumber: e.target.value }))}
                />
              </div>
            )}
            {selectedPayment === 'card' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={e => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Expiry</Label>
                    <Input
                      id="cardExpiry"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={paymentDetails.cardExpiry}
                      onChange={e => setPaymentDetails(prev => ({ ...prev, cardExpiry: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCVC">CVC</Label>
                    <Input
                      id="cardCVC"
                      name="cardCVC"
                      placeholder="123"
                      value={paymentDetails.cardCVC}
                      onChange={e => setPaymentDetails(prev => ({ ...prev, cardCVC: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <Button
                className="w-full"
                onClick={() => {
                  if (selectedPayment === 'mpesa' && !paymentDetails.mpesaNumber) return;
                  if (selectedPayment === 'card' && (!paymentDetails.cardNumber || !paymentDetails.cardExpiry || !paymentDetails.cardCVC)) return;
                  setShowPaymentModal(false);
                }}
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Checkout;