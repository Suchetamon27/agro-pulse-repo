-- Create insurance_policies table
CREATE TABLE insurance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  policy_type TEXT NOT NULL, -- 'frost', 'pest', 'drought', 'flood', 'heatwave'
  premium_amount DECIMAL(10, 2) NOT NULL,
  coverage_amount DECIMAL(10, 2) NOT NULL,
  policy_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'claimed', 'expired')),
  claim_amount DECIMAL(10, 2),
  claim_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_insurance_user ON insurance_policies(user_id, policy_date DESC);
CREATE INDEX idx_insurance_status ON insurance_policies(status, policy_date);

-- Enable RLS
ALTER TABLE insurance_policies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own policies"
  ON insurance_policies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own policies"
  ON insurance_policies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own policies"
  ON insurance_policies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view policies"
  ON insurance_policies FOR SELECT
  TO public
  USING (true);

-- Insert sample insurance policy
INSERT INTO insurance_policies (user_id, policy_type, premium_amount, coverage_amount, policy_date, status)
SELECT 
  id,
  'frost',
  50.00,
  2000.00,
  CURRENT_DATE - INTERVAL '2 days',
  'expired'
FROM users WHERE role = 'farmer' LIMIT 1;
