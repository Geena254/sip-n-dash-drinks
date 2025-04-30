
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
    city: '',
    zipCode: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    const requiredFields = ['name', 'email', 'phone', 'address'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      toast({
        title: "Please fill in all fields",
        description: `Missing: ${emptyFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    // Process order
    setIsSubmitting(true);
    
    setTimeout(() => {
      // Simulate API call
      clearCart();
      navigate('/confirmation', { 
        state: { 
          orderNumber: Math.floor(100000 + Math.random() * 900000).toString(),
          deliveryTime: '30-45 minutes'
        } 
      });
    }, 1500);
  };
  
  // Calculate delivery fee and tax
  const deliveryFee = 3.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + deliveryFee + tax;
  
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
                        ${(item.price * item.quantity).toFixed(2)}
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
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 bg-primary/5 p-4 rounded-md">
                <p className="text-sm font-medium text-primary">Estimated Delivery Time</p>
                <p className="text-sm text-muted-foreground">20-45 minutes from order time</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
