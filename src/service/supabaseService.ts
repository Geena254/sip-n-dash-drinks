
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
    const { data, error } = await supabase
      .from('Products')
      .select(`
        *,
        Categories!Products_category_id_fkey (
          id,
          name,
          description
        )
      `)
      .order('name')

    if (error) {
      console.error('Error fetching products:', error);
      // If the foreign key query fails, try a simpler query
      const { data: simpleData, error: simpleError } = await supabase
        .from('Products')
        .select('*')
        .order('name')
      
      if (simpleError) {
        console.error('Error with simple query:', simpleError);
        throw simpleError;
      }
      
      return simpleData?.map(product => ({
        ...product,
        category: product.category || 'Uncategorized'
      })) ?? []
    }
    return data ?? []
  },

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const { data, error } = await supabase
      .from('Products')
      .select(`
        *,
        Categories!Products_category_id_fkey (
          id,
          name,
          description
        )
      `)
      .eq('category_id', categoryId)

    if (error) {
      console.error('Error fetching products by category:', error);
      // Fallback to simple query
      const { data: simpleData, error: simpleError } = await supabase
        .from('Products')
        .select('*')
        .eq('category_id', categoryId)
      
      if (simpleError) throw simpleError;
      return simpleData?.map(product => ({
        ...product,
        category: product.category || 'Uncategorized'
      })) ?? []
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
