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
  image: string
  category_id: number
  category: Category
}

export const supabaseAPI = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data ?? []
  },

  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:category_id (
          id,
          name,
          description
        )
      `)
      .order('name')

    if (error) throw error
    return data ?? []
  },

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:category_id (
          id,
          name,
          description
        )
      `)
      .eq('category_id', categoryId)

    if (error) throw error
    return data ?? []
  },
  // Add new product
  async addProduct(productData) {
      const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      
      if (error) throw error
      return data[0]
  },

  // Upload image to Supabase Storage
  async uploadImage(file, bucket = 'product-images') {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)
      
      if (error) throw error
  
  // Get public URL
      const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
      
      return {
      path: data.path,
      publicUrl: publicData.publicUrl
      }
  },

// Delete image from storage
  async deleteImage(filePath, bucket = 'product-images') {
      const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])
      
      if (error) throw error
      return true
  }
}
