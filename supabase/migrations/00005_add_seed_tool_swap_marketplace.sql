-- Create listings table for Seed & Tool Swap marketplace
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('seed', 'tool', 'equipment')),
  item_type TEXT, -- For seeds: 'organic', 'hybrid', 'heirloom'
  quantity TEXT,
  price_per_unit DECIMAL(10, 2),
  rental_price_per_day DECIMAL(10, 2),
  is_for_rent BOOLEAN DEFAULT false,
  is_for_sale BOOLEAN DEFAULT true,
  image_url TEXT,
  location TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_user ON listings(user_id);
CREATE INDEX idx_listings_category ON listings(category, available);
CREATE INDEX idx_listings_created ON listings(created_at DESC);

-- Create requests table for marketplace requests
CREATE TABLE listing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  request_type TEXT CHECK (request_type IN ('purchase', 'rent')),
  quantity_requested TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_requests_listing ON listing_requests(listing_id);
CREATE INDEX idx_requests_requester ON listing_requests(requester_id);
CREATE INDEX idx_requests_owner ON listing_requests(owner_id, status);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'request')),
  read BOOLEAN DEFAULT false,
  related_id UUID, -- Can reference listing_id or request_id
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, read, created_at DESC);

-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for listings
CREATE POLICY "Anyone can view available listings"
  ON listings FOR SELECT
  TO public
  USING (available = true);

CREATE POLICY "Users can view their own listings"
  ON listings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for listing_requests
CREATE POLICY "Users can view requests they made"
  ON listing_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = owner_id);

CREATE POLICY "Users can create requests"
  ON listing_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Owners can update request status"
  ON listing_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Public can view requests"
  ON listing_requests FOR SELECT
  TO public
  USING (true);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view notifications"
  ON notifications FOR SELECT
  TO public
  USING (true);

-- Insert sample listings
INSERT INTO listings (user_id, title, description, category, item_type, quantity, price_per_unit, is_for_sale, location, available)
SELECT 
  id,
  'Organic Wheat Seeds',
  'High-quality organic wheat seeds, perfect for Punjab climate. Excellent germination rate.',
  'seed',
  'organic',
  '50 kg',
  450.00,
  true,
  'Ludhiana, Punjab',
  true
FROM users WHERE role = 'farmer' LIMIT 1;

INSERT INTO listings (user_id, title, description, category, item_type, quantity, price_per_unit, is_for_sale, location, available)
SELECT 
  id,
  'Heirloom Tomato Seeds',
  'Traditional heirloom tomato variety passed down through generations. Great taste and disease resistance.',
  'seed',
  'heirloom',
  '500 grams',
  800.00,
  true,
  'Amritsar, Punjab',
  true
FROM users WHERE role = 'farmer' LIMIT 1;

INSERT INTO listings (user_id, title, description, category, item_type, quantity, rental_price_per_day, is_for_rent, is_for_sale, location, available)
SELECT 
  id,
  'Rotavator - 7 feet',
  'Heavy-duty rotavator for soil preparation. Well-maintained, suitable for 2-3 acre farms.',
  'equipment',
  NULL,
  '1 unit',
  1200.00,
  true,
  false,
  'Jalandhar, Punjab',
  true
FROM users WHERE role = 'farmer' LIMIT 1;

INSERT INTO listings (user_id, title, description, category, item_type, quantity, price_per_unit, is_for_sale, location, available)
SELECT 
  id,
  'Hybrid Corn Seeds',
  'High-yield hybrid corn seeds with excellent drought tolerance. Suitable for kharif season.',
  'seed',
  'hybrid',
  '25 kg',
  650.00,
  true,
  'Patiala, Punjab',
  true
FROM users WHERE role = 'farmer' LIMIT 1;

INSERT INTO listings (user_id, title, description, category, rental_price_per_day, is_for_rent, is_for_sale, location, available)
SELECT 
  id,
  'Seed Drill Machine',
  'Automatic seed drill for precise sowing. Saves time and ensures uniform spacing.',
  'tool',
  800.00,
  true,
  false,
  'Bathinda, Punjab',
  true
FROM users WHERE role = 'farmer' LIMIT 1;

INSERT INTO listings (user_id, title, description, category, item_type, quantity, price_per_unit, is_for_sale, location, available)
SELECT 
  id,
  'Organic Mustard Seeds',
  'Certified organic mustard seeds. High oil content, perfect for Punjab soil.',
  'seed',
  'organic',
  '30 kg',
  520.00,
  true,
  'Moga, Punjab',
  true
FROM users WHERE role = 'farmer' LIMIT 1;
