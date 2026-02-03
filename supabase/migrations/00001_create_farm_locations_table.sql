-- Create farm_locations table for Indian farms
CREATE TABLE farm_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample Indian farm locations
INSERT INTO farm_locations (name, state, district, latitude, longitude) VALUES
  ('Green Valley Farms', 'Punjab', 'Ludhiana', 30.9010, 75.8573),
  ('Sunrise Agro', 'Maharashtra', 'Nashik', 19.9975, 73.7898),
  ('Golden Harvest', 'Karnataka', 'Mysuru', 12.2958, 76.6394),
  ('Monsoon Fields', 'Tamil Nadu', 'Coimbatore', 11.0168, 76.9558),
  ('Heritage Farms', 'Haryana', 'Karnal', 29.6857, 76.9905),
  ('Organic Valley', 'Uttar Pradesh', 'Meerut', 28.9845, 77.7064);

-- Enable RLS
ALTER TABLE farm_locations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to farm locations"
  ON farm_locations
  FOR SELECT
  TO public
  USING (true);
