
-- Create a table for cocktail recipes
CREATE TABLE public.cocktail_recipes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  prep_time INTEGER, -- in minutes
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample cocktail recipes
INSERT INTO public.cocktail_recipes (name, description, ingredients, instructions, prep_time, difficulty, image_url, category) VALUES
('Classic Mojito', 'A refreshing Cuban cocktail with mint and lime', '2 oz White Rum, 1 oz Fresh Lime Juice, 2 tsp Sugar, 6-8 Mint Leaves, Soda Water, Ice', '1. Muddle mint leaves with sugar and lime juice in a glass. 2. Add rum and fill with ice. 3. Top with soda water and stir gently. 4. Garnish with mint sprig and lime wheel.', 5, 'Easy', 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a', 'Classic'),
('Margarita', 'Classic tequila cocktail with lime and triple sec', '2 oz Tequila, 1 oz Triple Sec, 1 oz Fresh Lime Juice, Salt for rim, Lime wheel for garnish', '1. Rim glass with salt. 2. Combine tequila, triple sec, and lime juice in shaker with ice. 3. Shake well and strain into glass over ice. 4. Garnish with lime wheel.', 3, 'Easy', 'https://images.unsplash.com/photo-1609951651556-5334e2706168', 'Classic'),
('Old Fashioned', 'A classic whiskey cocktail with bitters and sugar', '2 oz Bourbon Whiskey, 1 sugar cube, 2-3 dashes Angostura bitters, Orange peel, Ice', '1. Muddle sugar cube with bitters in glass. 2. Add whiskey and ice. 3. Stir well. 4. Express orange peel oils over drink and drop in glass.', 4, 'Medium', 'https://images.unsplash.com/photo-1536935338788-846bb9981813', 'Classic'),
('Piña Colada', 'Tropical cocktail with rum, coconut, and pineapple', '2 oz White Rum, 1 oz Coconut Cream, 1 oz Heavy Cream, 6 oz Pineapple Juice, 2 cups Crushed Ice, Pineapple wedge and cherry for garnish', '1. Combine all ingredients in blender. 2. Blend until smooth. 3. Pour into hurricane glass. 4. Garnish with pineapple wedge and cherry.', 6, 'Easy', 'https://images.unsplash.com/photo-1609951651556-5334e2706168', 'Tropical'),
('Whiskey Sour', 'Classic sour cocktail with whiskey and lemon', '2 oz Bourbon Whiskey, 1 oz Fresh Lemon Juice, 0.75 oz Simple Syrup, 1 Egg White (optional), Lemon wheel and cherry for garnish', '1. Combine whiskey, lemon juice, and simple syrup in shaker. 2. Add egg white if using. 3. Dry shake, then shake with ice. 4. Strain into glass over ice. 5. Garnish with lemon wheel and cherry.', 4, 'Medium', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b', 'Sour');

-- Enable RLS (Row Level Security) - making it publicly readable for now
ALTER TABLE public.cocktail_recipes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to cocktail recipes
CREATE POLICY "Allow public read access to cocktail recipes" 
  ON public.cocktail_recipes 
  FOR SELECT 
  TO public 
  USING (true);
