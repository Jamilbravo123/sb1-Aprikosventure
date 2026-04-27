-- Investor pre-registration table
CREATE TABLE IF NOT EXISTS investors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  investor_type TEXT NOT NULL CHECK (investor_type IN ('private', 'institutional', 'family_office', 'fund')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  company TEXT,
  country TEXT NOT NULL,
  interests TEXT[] NOT NULL,
  commitment TEXT NOT NULL CHECK (commitment IN ('100k-250k', '250k-1m', '1m_plus', 'undisclosed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- Row Level Security
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own row
CREATE POLICY "Users can read own data"
  ON investors FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can insert during registration (before auth)
CREATE POLICY "Anon can insert during registration"
  ON investors FOR INSERT
  WITH CHECK (true);

-- Authenticated users can update their own row (for last_login, user_id binding)
CREATE POLICY "Users can update own data"
  ON investors FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);
