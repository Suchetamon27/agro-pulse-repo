-- Create produce_listings table for Shop
CREATE TABLE produce_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  price_per_unit DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  location TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_produce_user ON produce_listings(user_id);
CREATE INDEX idx_produce_status ON produce_listings(status, created_at DESC);

-- Create produce_transactions table
CREATE TABLE produce_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES produce_listings(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  quantity TEXT NOT NULL,
  transaction_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_buyer ON produce_transactions(buyer_id);
CREATE INDEX idx_transactions_seller ON produce_transactions(seller_id);

-- Create community_posts table for Q&A
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'pest', 'irrigation', 'fertilizer', 'harvest', 'equipment', 'weather')),
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_user ON community_posts(user_id);
CREATE INDEX idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX idx_posts_upvotes ON community_posts(upvotes DESC);

-- Create community_answers table
CREATE TABLE community_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_ai_answer BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_answers_post ON community_answers(post_id, created_at);
CREATE INDEX idx_answers_user ON community_answers(user_id);

-- Enable RLS
ALTER TABLE produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE produce_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for produce_listings
CREATE POLICY "Anyone can view available listings"
  ON produce_listings FOR SELECT
  TO public
  USING (status = 'available');

CREATE POLICY "Users can view their own listings"
  ON produce_listings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own listings"
  ON produce_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
  ON produce_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
  ON produce_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for produce_transactions
CREATE POLICY "Users can view their transactions"
  ON produce_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create transactions"
  ON produce_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Public can view transactions"
  ON produce_transactions FOR SELECT
  TO public
  USING (true);

-- RLS Policies for community_posts
CREATE POLICY "Anyone can view posts"
  ON community_posts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for community_answers
CREATE POLICY "Anyone can view answers"
  ON community_answers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create answers"
  ON community_answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers"
  ON community_answers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample produce listings
INSERT INTO produce_listings (user_id, crop_type, quantity, price_per_unit, total_price, location, status)
SELECT 
  id,
  'Wheat',
  '50 quintals',
  2150.00,
  107500.00,
  'Ludhiana, Punjab',
  'available'
FROM users WHERE role = 'farmer' LIMIT 1;

INSERT INTO produce_listings (user_id, crop_type, quantity, price_per_unit, total_price, location, status)
SELECT 
  id,
  'Rice',
  '30 quintals',
  2850.00,
  85500.00,
  'Amritsar, Punjab',
  'available'
FROM users WHERE role = 'farmer' LIMIT 1;

-- Insert sample community posts
INSERT INTO community_posts (user_id, title, content, category)
SELECT 
  id,
  'How to control aphids on wheat crop?',
  'I am seeing aphid infestation on my wheat crop. The leaves are turning yellow. What is the best organic method to control this?',
  'pest'
FROM users WHERE role = 'farmer' LIMIT 1;

INSERT INTO community_posts (user_id, title, content, category)
SELECT 
  id,
  'Best time for rice transplanting in Punjab?',
  'What is the optimal time for rice transplanting in Punjab region? Should I wait for more rain or start now?',
  'general'
FROM users WHERE role = 'farmer' LIMIT 1;
