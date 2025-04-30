
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Percent, Tag, Calendar, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Offer {
  id: number;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'bogo';
  discountValue: number;
  code: string;
  validUntil: string;
  bgColor: string;
  category?: string;
}

const offers: Offer[] = [
  {
    id: 1,
    title: "20% Off Wine",
    description: "Get 20% off on all wine bottles. Perfect for stocking up your wine collection.",
    discountType: "percentage",
    discountValue: 20,
    code: "WINE20",
    validUntil: "2025-05-30",
    bgColor: "bg-gradient-to-br from-pink-50 to-rose-100",
    category: "Wine"
  },
  {
    id: 2,
    title: "Buy 2 Get 1 Free",
    description: "Purchase any two craft beers and get one free. Limited time offer.",
    discountType: "bogo",
    discountValue: 1,
    code: "BEER3FOR2",
    validUntil: "2025-05-15",
    bgColor: "bg-gradient-to-br from-amber-50 to-yellow-100",
    category: "Beer"
  },
  {
    id: 3,
    title: "$10 Off Premium Spirits",
    description: "Enjoy $10 off on any premium spirit of your choice over $40.",
    discountType: "fixed",
    discountValue: 10,
    code: "SPIRITS10",
    validUntil: "2025-06-10",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100",
    category: "Spirits"
  },
  {
    id: 4,
    title: "15% Off Non-Alcoholic",
    description: "Get 15% off on all non-alcoholic beverages in our collection.",
    discountType: "percentage",
    discountValue: 15,
    code: "NONA15",
    validUntil: "2025-05-25",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-100",
    category: "Non-Alcoholic"
  },
  {
    id: 5,
    title: "First Order Special",
    description: "First-time customers get 25% off their first order.",
    discountType: "percentage",
    discountValue: 25,
    code: "WELCOME25",
    validUntil: "2025-12-31",
    bgColor: "bg-gradient-to-br from-purple-50 to-violet-100"
  },
  {
    id: 6,
    title: "Free Delivery",
    description: "Free delivery on orders over $50. No code needed, applies automatically.",
    discountType: "fixed",
    discountValue: 0,
    code: "AUTO-APPLIED",
    validUntil: "2025-06-30",
    bgColor: "bg-gradient-to-br from-gray-50 to-slate-100"
  }
];

const Offers: React.FC = () => {
  // Format the date from ISO string to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Special Offers
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Take advantage of these exclusive deals and discounts on your favorite drinks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <Card 
            key={offer.id} 
            className="overflow-hidden border-0 shadow-md transition-all transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`${offer.bgColor} p-6`}>
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                  {offer.discountType === 'percentage' 
                    ? `${offer.discountValue}% OFF` 
                    : offer.discountType === 'fixed' 
                      ? (offer.discountValue > 0 ? `$${offer.discountValue} OFF` : 'FREE DELIVERY')
                      : 'BUY 2 GET 1 FREE'}
                </Badge>
                {offer.category && (
                  <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                    {offer.category}
                  </Badge>
                )}
              </div>
              <div className="mt-12 mb-4">
                {offer.discountType === 'percentage' ? (
                  <Percent className="h-16 w-16 text-primary opacity-20" />
                ) : offer.discountType === 'bogo' ? (
                  <Tag className="h-16 w-16 text-primary opacity-20" />
                ) : (
                  <ShoppingBag className="h-16 w-16 text-primary opacity-20" />
                )}
              </div>
            </div>

            <CardHeader>
              <CardTitle>{offer.title}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground">{offer.description}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span>Valid until: <span className="font-medium">{formatDate(offer.validUntil)}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Tag size={16} className="text-muted-foreground" />
                  <span>Code: <span className="font-medium">{offer.code}</span></span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1" 
                onClick={() => navigator.clipboard.writeText(offer.code)}
              >
                <span>Copy Code</span>
              </Button>
              <Link to="/">
                <Button className="gap-1" size="sm">
                  <Clock size={14} />
                  <span>Shop Now</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Join Our Newsletter</h3>
        <p className="text-muted-foreground mb-4">
          Subscribe to get exclusive offers and updates on new arrivals.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input 
            placeholder="Your email address" 
            className="bg-white"
          />
          <Button>Subscribe</Button>
        </div>
      </div>
    </div>
  );
};

export default Offers;
