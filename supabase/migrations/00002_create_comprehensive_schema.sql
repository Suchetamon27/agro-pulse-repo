-- Create Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer')),
  phone TEXT,
  farm_location_id UUID REFERENCES farm_locations(id),
  wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create SensorData table
CREATE TABLE sensor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  soil_moisture DECIMAL(5, 2) NOT NULL CHECK (soil_moisture >= 0 AND soil_moisture <= 100),
  temperature DECIMAL(5, 2) NOT NULL,
  humidity DECIMAL(5, 2) CHECK (humidity >= 0 AND humidity <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for geospatial queries
CREATE INDEX idx_sensor_data_location ON sensor_data(latitude, longitude);
CREATE INDEX idx_sensor_data_timestamp ON sensor_data(timestamp DESC);

-- Create Alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('frost', 'heat_wave', 'pest', 'drought', 'flood', 'disease')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  area_radius DECIMAL(10, 2) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_farms INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_alerts_location ON alerts(latitude, longitude);
CREATE INDEX idx_alerts_active ON alerts(is_active, created_at DESC);

-- Create Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  data_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_sender ON transactions(sender_id, created_at DESC);
CREATE INDEX idx_transactions_receiver ON transactions(receiver_id, created_at DESC);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Public can view farmer profiles"
  ON users FOR SELECT
  TO public
  USING (role = 'farmer');

-- RLS Policies for SensorData
CREATE POLICY "Users can insert their own sensor data"
  ON sensor_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sensor data"
  ON sensor_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view sensor data for marketplace"
  ON sensor_data FOR SELECT
  TO public
  USING (true);

-- RLS Policies for Alerts
CREATE POLICY "Anyone can view active alerts"
  ON alerts FOR SELECT
  TO public
  USING (is_active = true);

-- RLS Policies for Transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Public can view transaction history"
  ON transactions FOR SELECT
  TO public
  USING (true);
