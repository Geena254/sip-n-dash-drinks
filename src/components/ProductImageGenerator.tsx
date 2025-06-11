
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
}

interface ProductImageGeneratorProps {
  products: Product[];
  onImageGenerated: (productId: number, imageUrl: string) => void;
}

const ProductImageGenerator: React.FC<ProductImageGeneratorProps> = ({ 
  products, 
  onImageGenerated 
}) => {
  const [generatingIds, setGeneratingIds] = useState<Set<number>>(new Set());
  const [generatedIds, setGeneratedIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const productsWithoutImages = products.filter(product => 
    !product.image_url || product.image_url === '/placeholder.svg'
  );

  const generateImage = async (product: Product) => {
    setGeneratingIds(prev => new Set(prev).add(product.id));

    try {
      const response = await fetch('/api/generate-product-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: product.name,
          productType: product.category,
          description: product.description
        }),
      });

      const data = await response.json();

      if (data.success) {
        onImageGenerated(product.id, data.imageUrl);
        setGeneratedIds(prev => new Set(prev).add(product.id));
        toast({
          title: "Image Generated!",
          description: `Successfully generated image for ${product.name}`,
        });
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Generation Failed",
        description: `Failed to generate image for ${product.name}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setGeneratingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  const generateAllImages = async () => {
    const promises = productsWithoutImages.map(product => generateImage(product));
    await Promise.allSettled(promises);
  };

  if (productsWithoutImages.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">All Products Have Images!</h3>
          <p className="text-muted-foreground">All your products already have images assigned.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Generate Product Images
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {productsWithoutImages.length} products need images
          </p>
          <Button 
            onClick={generateAllImages}
            disabled={generatingIds.size > 0}
            className="ml-auto"
          >
            {generatingIds.size > 0 ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate All Images'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {productsWithoutImages.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <div className="flex items-center gap-2">
                {generatedIds.has(product.id) && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Generated
                  </Badge>
                )}
                <Button
                  size="sm"
                  onClick={() => generateImage(product)}
                  disabled={generatingIds.has(product.id) || generatedIds.has(product.id)}
                >
                  {generatingIds.has(product.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : generatedIds.has(product.id) ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    'Generate'
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductImageGenerator;
