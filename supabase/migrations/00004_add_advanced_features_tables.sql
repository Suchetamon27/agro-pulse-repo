-- Create plant_diagnoses table for Plant Doctor history
CREATE TABLE plant_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  diagnosis TEXT NOT NULL,
  treatment TEXT NOT NULL,
  confidence_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plant_diagnoses_user ON plant_diagnoses(user_id, created_at DESC);

-- Create market_prices table for Market Intelligence
CREATE TABLE market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  unit TEXT DEFAULT 'per quintal',
  market_location TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_market_prices_crop ON market_prices(crop_name, recorded_at DESC);

-- Create carbon_credits table for Carbon Shield
CREATE TABLE carbon_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  credits_earned DECIMAL(10, 2) DEFAULT 0.00,
  sustainability_score INTEGER DEFAULT 0,
  water_efficiency_score INTEGER DEFAULT 0,
  soil_health_score INTEGER DEFAULT 0,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_carbon_credits_user ON carbon_credits(user_id);

-- Enable RLS
ALTER TABLE plant_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_credits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plant_diagnoses
CREATE POLICY "Users can view their own diagnoses"
  ON plant_diagnoses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnoses"
  ON plant_diagnoses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view diagnoses"
  ON plant_diagnoses FOR SELECT
  TO public
  USING (true);

-- RLS Policies for market_prices
CREATE POLICY "Anyone can view market prices"
  ON market_prices FOR SELECT
  TO public
  USING (true);

-- RLS Policies for carbon_credits
CREATE POLICY "Users can view their own carbon credits"
  ON carbon_credits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own carbon credits"
  ON carbon_credits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view carbon credits"
  ON carbon_credits FOR SELECT
  TO public
  USING (true);

-- Insert initial carbon credits for existing users
INSERT INTO carbon_credits (user_id, credits_earned, sustainability_score)
SELECT id, 0, 50
FROM users
WHERE role = 'farmer'
ON CONFLICT DO NOTHING;
