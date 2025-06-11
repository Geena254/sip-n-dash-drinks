
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Percent, Tag, Calendar, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { supabaseAPI } from '@/service/supabaseService';

interface Offer {
  id: number;
  title: string;
  description: string;
  discount: string;
  code: string;
  end_date: string;
}

const Offers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await supabaseAPI.getOffers();
        setOffers(data);
      } catch (err) {
        console.error('Error loading offers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Format the date from ISO string to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold barrush-gradient-text from-primary to-secondary bg-clip-text text-transparent">
          Special Offers
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Take advantage of these exclusive deals and discounts on your favorite drinks.
        </p>
      </div>

      {offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Card
              key={offer.id}
              className="overflow-hidden border-0 shadow-md transition-all transform hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className='bg-gradient-to-br from-pink-50 to-rose-100 p-6'>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                    {offer.discount}
                  </Badge>
                </div>
                <div className="mt-12 mb-4">
                  <Percent className="h-16 w-16 text-primary opacity-20" />
                </div>
              </CardContent>

              <CardHeader>
                <CardTitle>{offer.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground">{offer.description}</p>

                <div className="mt-4 space-y-2">
                  {offer.end_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span>Valid until: <span className="font-medium">{formatDate(offer.end_date)}</span></span>
                    </div>
                  )}
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
                <Link to="/categories">
                  <Button className="gap-1" size="sm">
                    <Clock size={14} />
                    <span>Shop Now</span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
          <h3 className="mt-4 text-lg font-medium">No offers available</h3>
          <p className="text-muted-foreground">
            Check back later for exciting deals and discounts.
          </p>
        </div>
      )}

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
