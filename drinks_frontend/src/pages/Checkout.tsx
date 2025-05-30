import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const Checkout: React.FC = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = useLocation();
  const { orderNumber, deliveryTime, orderDate } = state || {};

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    latitude: 0,
    longitude: 0,
    payment_method: '',
    deliveryArea: '',
    addressInputType: 'picker' // 'picker' or 'manual'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    mpesaNumber: '',
    mpesaTillNumber: '',
    mpesaStoreNumber: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const deliveryAreas = [
    { name: 'Mnarani', price: 150 },
    { name: 'Bofa', price: 200 },
    { name: 'Tezo', price: 250 },
    { name: 'Mtondia', price: 300 },
  ];

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

  const sendWhatsAppNotification = async (to: string, message: string) => {
    try {
      const response = await axios.post('/api/whatsapp', {
        to: `whatsapp:+${to}`,
        message
      });
      console.log('WhatsApp notification sent:', response.data);
    } catch (error) {
      console.error('Failed to send WhatsApp notification:', error);
    }
  };

  const sendEmailNotification = async (to: string, subject: string, body: string) => {
    try {
      const response = await axios.post('/api/email', {
        to,
        subject,
        body
      });
      console.log('Email notification sent:', response.data);
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  };

  const selectedArea = deliveryAreas.find(area => area.name === formData.deliveryArea);
  const deliveryFee = selectedArea ? selectedArea.price : 0;
  const tax = cartTotal * 0.05;
  const total = cartTotal + deliveryFee + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const phoneRegex = /^07\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Use format: 07XXXXXXXX",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    const requiredFields = ['name', 'phone', 'address', 'deliveryArea'];
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

    try {
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
          phone: formData.phone,
          delivery_area: formData.deliveryArea,
        },
        products: items.reduce((acc, item) => {
          acc[item.name] = { quantity: item.quantity };
          return acc;
        }, {}),
        status: 'initiated',
        order_total: Math.round(orderSummary.total),
        payment_method: selectedPayment
      };

      const res = await createOrder(orderData);
      const orderId = res.order_id;

      // Send customer WhatsApp confirmation
      await sendWhatsAppNotification(
        formData.phone,
        `Order #${orderId} confirmed! Total: KES ${total.toLocaleString('en-KE')}. Estimated delivery in 30-45 minutes.`
      );

      // Send seller notification (WhatsApp and Email)
      const sellerMessage = `New Order #${orderId}\nCustomer: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}\nArea: ${formData.deliveryArea}\nItems:\n${items.map(item => `${item.name} x${item.quantity} - KES ${item.price * item.quantity}`).join('\n')}\nTotal: KES ${total.toLocaleString('en-KE')}\nPayment: ${selectedPayment}`;
      await sendWhatsAppNotification(
        process.env.SELLER_PHONE,
        sellerMessage
      );
      await sendEmailNotification(
        process.env.SELLER_EMAIL,
        `New Order #${orderId}`,
        sellerMessage.replace('\n', '<br>')
      );

      // Schedule arrival notification
      setTimeout(async () => {
        await sendWhatsAppNotification(
          formData.phone,
          `Order #${orderId} has arrived! Thank you for your purchase.`
        );
      }, 5 * 60 * 1000); // 5 minutes later

      clearCart();
      navigate('/confirmation', {
        state: {
          orderNumber: orderId,
          deliveryTime: '30-45 minutes',
          orderDate: res.date
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="07XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="transition-all focus-within:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address Input Method</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, addressInputType: 'picker' }))}
                      className={formData.addressInputType === 'picker' ? 'bg-primary text-white' : 'bg-gray-200'}
                    >
                      Use Location Picker
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, addressInputType: 'manual' }))}
                      className={formData.addressInputType === 'manual' ? 'bg-primary text-white' : 'bg-gray-200'}
                    >
                      Enter Manually
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  {formData.addressInputType === 'picker' ? (
                    <LocationPicker
                      onLocationSelect={handleLocationSelect}
                      initialAddress={formData.address}
                    />
                  ) : (
                    <Input
                      id="address"
                      name="address"
                      placeholder="Enter full address"
                      value={formData.address}
                      onChange={handleChange}
                      className="transition-all focus-within:border-primary"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="flex gap-4 flex-wrap">
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
                        className={`p-3 border rounded-lg flex flex-col items-center justify-center w-24 transition-all ${selectedPayment === type ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
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
                        KES {(item.price * item.quantity).toLocaleString('en-KE')}
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
                <p className="text-muted-foreground">Order date: <strong>{orderDate ? new Date(orderDate).toLocaleString('en-KE') : 'N/A'}</strong></p>
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
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="mpesaTillNumber">Till Number: </Label>
                  3547836
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mpesaStoreNumber">Store Number: </Label>
                  5950470
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mpesaNumber">MPESA Number:</Label>
                  <Input
                    id="mpesaNumber"
                    name="mpesaNumber"
                    placeholder="07XXXXXXXX"
                    value={paymentDetails.mpesaNumber}
                    onChange={e => setPaymentDetails(prev => ({ ...prev, mpesaNumber: e.target.value }))}
                  />
                </div>
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
                  if (selectedPayment === 'mpesa' && (!paymentDetails.mpesaNumber || !paymentDetails.mpesaTillNumber || !paymentDetails.mpesaStoreNumber)) return;
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