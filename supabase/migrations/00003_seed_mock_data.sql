-- Insert 10 farms within 5km radius of center point (30.9010, 75.8573)
-- Using approximate lat/long offsets: 1km ≈ 0.009° latitude, 0.011° longitude at this latitude

INSERT INTO farm_locations (name, state, district, latitude, longitude) VALUES
  ('Ravi Valley Farm', 'Punjab', 'Ludhiana', 30.9050, 75.8600),
  ('Golden Fields Estate', 'Punjab', 'Ludhiana', 30.8980, 75.8520),
  ('Sunrise Agro Park', 'Punjab', 'Ludhiana', 30.9100, 75.8650),
  ('Green Harvest Co-op', 'Punjab', 'Ludhiana', 30.8950, 75.8600),
  ('Punjab Pride Farms', 'Punjab', 'Ludhiana', 30.9080, 75.8500),
  ('Wheat Valley Organics', 'Punjab', 'Ludhiana', 30.8970, 75.8680),
  ('Monsoon Ridge Farm', 'Punjab', 'Ludhiana', 30.9120, 75.8550),
  ('Heritage Crop Fields', 'Punjab', 'Ludhiana', 30.8920, 75.8630),
  ('Eco Valley Farms', 'Punjab', 'Ludhiana', 30.9060, 75.8480),
  ('Prosperity Agro', 'Punjab', 'Ludhiana', 30.8990, 75.8700)
ON CONFLICT DO NOTHING;

-- Insert mock users (farmers)
INSERT INTO users (email, password_hash, name, role, phone, farm_location_id, wallet_balance) 
SELECT 
  LOWER(REPLACE(fl.name, ' ', '.')) || '@farm.in',
  '$2a$10$rKZvVqVvVqVvVqVvVqVvVuO7K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8',
  'Owner of ' || fl.name,
  'farmer',
  '+91' || LPAD(FLOOR(RANDOM() * 10000000000)::TEXT, 10, '0'),
  fl.id,
  ROUND((RANDOM() * 5000 + 1000)::NUMERIC, 2)
FROM farm_locations fl
WHERE fl.name IN (
  'Ravi Valley Farm', 'Golden Fields Estate', 'Sunrise Agro Park', 
  'Green Harvest Co-op', 'Punjab Pride Farms', 'Wheat Valley Organics',
  'Monsoon Ridge Farm', 'Heritage Crop Fields', 'Eco Valley Farms', 'Prosperity Agro'
);

-- Insert mock sensor data for the last 24 hours
INSERT INTO sensor_data (user_id, timestamp, latitude, longitude, soil_moisture, temperature, humidity)
SELECT 
  u.id,
  NOW() - (INTERVAL '1 hour' * generate_series(0, 23)),
  fl.latitude + (RANDOM() * 0.001 - 0.0005),
  fl.longitude + (RANDOM() * 0.001 - 0.0005),
  ROUND((RANDOM() * 40 + 30)::NUMERIC, 2),
  ROUND((RANDOM() * 15 + 20)::NUMERIC, 2),
  ROUND((RANDOM() * 30 + 50)::NUMERIC, 2)
FROM users u
JOIN farm_locations fl ON u.farm_location_id = fl.id
WHERE u.role = 'farmer'
  AND fl.name IN (
    'Ravi Valley Farm', 'Golden Fields Estate', 'Sunrise Agro Park', 
    'Green Harvest Co-op', 'Punjab Pride Farms', 'Wheat Valley Organics',
    'Monsoon Ridge Farm', 'Heritage Crop Fields', 'Eco Valley Farms', 'Prosperity Agro'
  );

-- Insert some recent alerts
INSERT INTO alerts (alert_type, severity, latitude, longitude, area_radius, title, description, affected_farms, expires_at)
VALUES
  ('heat_wave', 'high', 30.9010, 75.8573, 5.0, 'Heat Wave Warning', 'Temperature expected to exceed 42°C in the next 48 hours. Ensure adequate irrigation.', 8, NOW() + INTERVAL '2 days'),
  ('pest', 'medium', 30.9050, 75.8600, 3.0, 'Bollworm Detection', 'Early signs of bollworm infestation detected. Preventive measures recommended.', 4, NOW() + INTERVAL '5 days'),
  ('drought', 'low', 30.8950, 75.8600, 4.0, 'Low Soil Moisture Alert', 'Soil moisture levels dropping below optimal range in several farms.', 5, NOW() + INTERVAL '3 days');

-- Insert mock transactions
INSERT INTO transactions (sender_id, receiver_id, amount, data_type, status, description)
SELECT 
  u1.id,
  u2.id,
  ROUND((RANDOM() * 50 + 5)::NUMERIC, 2),
  CASE FLOOR(RANDOM() * 4)
    WHEN 0 THEN 'Soil Health Data'
    WHEN 1 THEN 'Pest Monitoring Data'
    WHEN 2 THEN 'Weather Data'
    ELSE 'Irrigation Data'
  END,
  'completed',
  'Data purchase transaction'
FROM users u1
CROSS JOIN users u2
WHERE u1.id != u2.id
  AND u1.role = 'farmer'
  AND u2.role = 'farmer'
LIMIT 20;

-- Create a function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL, lon1 DECIMAL, 
  lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  r DECIMAL := 6371; -- Earth radius in km
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dlat := RADIANS(lat2 - lat1);
  dlon := RADIANS(lon2 - lon1);
  a := SIN(dlat/2) * SIN(dlat/2) + 
       COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * 
       SIN(dlon/2) * SIN(dlon/2);
  c := 2 * ATAN2(SQRT(a), SQRT(1-a));
  RETURN r * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
