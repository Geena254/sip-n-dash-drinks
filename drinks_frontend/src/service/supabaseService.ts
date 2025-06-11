
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_ANON_KEY);

// Define types
export type Category = {
  id: number
  name: string
  description: string
  product_count?: number
}

export type Product = {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category_id: number
  category: string | Category
}

export type CocktailRecipe = {
  id: number
  name: string
  description: string
  ingredients: string
  instructions: string
  prep_time: number
  difficulty: string
  image_url: string
  category: string
  created_at: string
}

export type Offer = {
  id: number
  title: string
  description: string
  discount: string
  code: string
  end_date: string
}

export const supabaseAPI = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('Categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    return data ?? []
  },

  async getProducts(): Promise<Product[]> {
    const { data: products, error } = await supabase
      .from('Products')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    if (!products) return [];

    const { data: categories } = await supabase
      .from('Categories')
      .select('*');

    const productsWithCategories = products.map(product => {
      // First try to match by category_id
      let category = categories?.find(cat => cat.id === product.category_id);
      
      // If no match by ID, try to match by name (case-insensitive)
      if (!category && product.category) {
        category = categories?.find(cat => 
          cat.name?.toLowerCase() === product.category?.toLowerCase()
        );
      }
      
      // If still no match, try partial matching for common variations
      if (!category && product.category) {
        const productCat = product.category.toLowerCase();
        category = categories?.find(cat => {
          const catName = cat.name?.toLowerCase() || '';
          return catName.includes(productCat) || productCat.includes(catName);
        });
      }

      return {
        ...product,
        category: category ? { 
          id: category.id, 
          name: category.name, 
          description: category.description 
        } : product.category || 'Uncategorized'
      };
    });

    console.log("Products with mapped categories:", productsWithCategories);
    return productsWithCategories;
  },

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    // Get the category details first
    const { data: category } = await supabase
      .from('Categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (!category) return [];

    // Try to find products by category_id first
    let { data: products } = await supabase
      .from('Products')
      .select('*')
      .eq('category_id', categoryId);

    // If no products found by ID, try by category name (case-insensitive)
    if (!products || products.length === 0) {
      const { data: productsByName } = await supabase
        .from('Products')
        .select('*')
        .ilike('category', `%${category.name}%`);
      
      products = productsByName || [];
    }

    if (!products) return [];

    return products.map(product => ({
      ...product,
      category: { 
        id: category.id, 
        name: category.name, 
        description: category.description 
      }
    }));
  },

  async getCocktailRecipes(): Promise<CocktailRecipe[]> {
    const { data, error } = await supabase
      .from('cocktail_recipes')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching cocktail recipes:', error);
      throw error;
    }
    return data ?? []
  },

  async getOffers(): Promise<Offer[]> {
    const { data, error } = await supabase
      .from('Offers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
    return data ?? []
  },

  async addProduct(productData: any) {
    const { data, error } = await supabase
      .from('Products')
      .insert([productData])
      .select()
      
    if (error) throw error
    return data[0]
  },

  async uploadImage(file: File, bucket = 'product-images') {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)
      
    if (error) throw error

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
      
    return {
      path: data.path,
      publicUrl: publicData.publicUrl
    }
  },

  async deleteImage(filePath: string, bucket = 'product-images') {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])
      
    if (error) throw error
    return true
  }
}
