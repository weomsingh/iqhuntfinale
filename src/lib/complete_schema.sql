-- ================================================
-- IQHUNT v19.0 - COMPLETE DATABASE SCHEMA
-- ================================================
-- Run this entire script in Supabase SQL Editor
-- Replace any existing schema

-- ================================================
-- 1. DROP EXISTING TABLES (Clean Slate)
-- ================================================

DROP TABLE IF EXISTS admin_actions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS war_room_messages CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS hunter_stakes CASCADE;
DROP TABLE IF EXISTS bounties CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ================================================
-- 2. PROFILES TABLE (Enhanced)
-- ================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('hunter', 'payer', 'admin')),
  
  -- Common fields
  username TEXT UNIQUE NOT NULL,
  nationality TEXT NOT NULL CHECK (nationality IN ('india', 'global')),
  currency TEXT NOT NULL CHECK (currency IN ('INR', 'USD')),
  accepted_covenant BOOLEAN DEFAULT false,
  
  -- Financial
  wallet_balance NUMERIC DEFAULT 0 CHECK (wallet_balance >= 0),
  total_earnings NUMERIC DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  
  -- Hunter-specific fields
  expertise TEXT[],
  bio TEXT,
  date_of_birth DATE,
  hunts_completed INTEGER DEFAULT 0,
  hunts_won INTEGER DEFAULT 0,
  success_rate NUMERIC DEFAULT 0,
  
  -- Payer-specific fields
  is_organization BOOLEAN DEFAULT false,
  company_name TEXT,
  verified_status BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 3. BOUNTIES TABLE
-- ================================================

CREATE TABLE bounties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Core details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward NUMERIC NOT NULL CHECK (reward > 0),
  currency TEXT NOT NULL CHECK (currency IN ('INR', 'USD')),
  
  -- Constraints
  max_hunters INTEGER DEFAULT 3 CHECK (max_hunters BETWEEN 1 AND 10),
  entry_fee NUMERIC DEFAULT 0 CHECK (entry_fee >= 0),
  submission_deadline TIMESTAMPTZ NOT NULL,
  
  -- Financial
  vault_amount NUMERIC DEFAULT 0, -- 105% escrow
  vault_funded BOOLEAN DEFAULT false,
  
  -- Content
  pdf_url TEXT, -- Supabase storage URL
  
  -- State
  status TEXT DEFAULT 'pending_approval' CHECK (status IN (
    'pending_approval', 'live', 'in_progress', 'completed', 'cancelled'
  )),
  admin_verified BOOLEAN DEFAULT false,
  winner_id UUID REFERENCES profiles(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ================================================
-- 4. HUNTER_STAKES TABLE
-- ================================================

CREATE TABLE hunter_stakes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hunter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bounty_id UUID REFERENCES bounties(id) ON DELETE CASCADE NOT NULL,
  
  -- State
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'rejected', 'won', 'lost')),
  entry_fee NUMERIC NOT NULL,
  
  -- Timestamps
  staked_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(hunter_id, bounty_id)
);

-- Create index for performance
CREATE INDEX idx_hunter_stakes_active ON hunter_stakes(hunter_id) WHERE status = 'active';

-- ================================================
-- 5. SUBMISSIONS TABLE
-- ================================================

CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hunter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bounty_id UUID REFERENCES bounties(id) ON DELETE CASCADE NOT NULL,
  
  -- Content
  submission_url TEXT NOT NULL,
  notes TEXT,
  
  -- AI Scoring (mock)
  ai_score INTEGER CHECK (ai_score BETWEEN 0 AND 100),
  
  -- Verdict
  selected_as_winner BOOLEAN DEFAULT false,
  
  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Only one submission per hunter per bounty
  UNIQUE(hunter_id, bounty_id)
);

-- ================================================
-- 6. WAR_ROOM_MESSAGES TABLE (Ephemeral)
-- ================================================

CREATE TABLE war_room_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bounty_id UUID REFERENCES bounties(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('hunter', 'payer', 'admin')),
  
  -- Content
  message TEXT NOT NULL,
  
  -- Timestamp
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_war_room_bounty ON war_room_messages(bounty_id, sent_at DESC);

-- ================================================
-- 7. TRANSACTIONS TABLE
-- ================================================

CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bounty_id UUID REFERENCES bounties(id) ON DELETE SET NULL,
  
  -- Type
  type TEXT NOT NULL CHECK (type IN (
    'deposit', 'withdrawal', 'stake', 'payout', 'refund', 'admin_credit'
  )),
  
  -- Financial
  amount NUMERIC NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL CHECK (currency IN ('INR', 'USD')),
  
  -- Verification
  utr TEXT, -- Bank transaction reference
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_transactions_user ON transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_pending ON transactions(status) WHERE status = 'pending';

-- ================================================
-- 8. ADMIN_ACTIONS TABLE (Audit Log)
-- ================================================

CREATE TABLE admin_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Target
  target_type TEXT NOT NULL CHECK (target_type IN ('bounty', 'transaction', 'user')),
  target_id UUID NOT NULL,
  
  -- Action
  action_type TEXT NOT NULL,
  notes TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_actions_target ON admin_actions(target_type, target_id);

-- ================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE hunter_stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE war_room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Bounties: Everyone can read, payer can create/update own
CREATE POLICY "Bounties are viewable by everyone" ON bounties FOR SELECT USING (true);
CREATE POLICY "Payers can create bounties" ON bounties FOR INSERT WITH CHECK (
  auth.uid() = payer_id AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'payer'
  )
);
CREATE POLICY "Payers can update own bounties" ON bounties FOR UPDATE USING (auth.uid() = payer_id);

-- Hunter Stakes: Viewable by payer and staked hunters
CREATE POLICY "Stakes viewable by involved parties" ON hunter_stakes FOR SELECT USING (
  auth.uid() = hunter_id OR 
  auth.uid() IN (SELECT payer_id FROM bounties WHERE id = bounty_id)
);
CREATE POLICY "Hunters can create stakes" ON hunter_stakes FOR INSERT WITH CHECK (
  auth.uid() = hunter_id
);

-- Submissions: Viewable by payer and submitter
CREATE POLICY "Submissions viewable by payer and hunter" ON submissions FOR SELECT USING (
  auth.uid() = hunter_id OR 
  auth.uid() IN (SELECT payer_id FROM bounties WHERE id = bounty_id)
);
CREATE POLICY "Hunters can submit" ON submissions FOR INSERT WITH CHECK (
  auth.uid() = hunter_id
);

-- War Room: Viewable and writable by payer and staked hunters
CREATE POLICY "War room viewable by participants" ON war_room_messages FOR SELECT USING (
  auth.uid() = sender_id OR
  auth.uid() IN (SELECT payer_id FROM bounties WHERE id = bounty_id) OR
  auth.uid() IN (SELECT hunter_id FROM hunter_stakes WHERE bounty_id = war_room_messages.bounty_id)
);
CREATE POLICY "Participants can send messages" ON war_room_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND (
    auth.uid() IN (SELECT payer_id FROM bounties WHERE id = bounty_id) OR
    auth.uid() IN (SELECT hunter_id FROM hunter_stakes WHERE bounty_id = war_room_messages.bounty_id)
  )
);

-- Transactions: Users can view own
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Users can create own transactions" ON transactions FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- Admin Actions: Admins only
CREATE POLICY "Admins can view all actions" ON admin_actions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can create actions" ON admin_actions FOR INSERT WITH CHECK (
  auth.uid() = admin_id
);

-- ================================================
-- 10. POSTGRESQL FUNCTIONS (RPC)
-- ================================================

-- Function 1: Lock Target (Stake on Bounty)
CREATE OR REPLACE FUNCTION lock_target(
  p_bounty_id UUID,
  p_hunter_id UUID,
  p_entry_fee NUMERIC
)
RETURNS JSON AS $$
DECLARE
  v_active_stakes INTEGER;
  v_max_hunters INTEGER;
  v_current_hunters INTEGER;
  v_hunter_balance NUMERIC;
  v_result JSON;
BEGIN
  -- Check if hunter already has an active stake
  SELECT COUNT(*) INTO v_active_stakes
  FROM hunter_stakes
  WHERE hunter_id = p_hunter_id AND status = 'active';
  
  IF v_active_stakes > 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'You already have an active stake on another bounty. Complete or cancel it first.'
    );
  END IF;
  
  -- Check if bounty is accepting stakes
  SELECT max_hunters INTO v_max_hunters
  FROM bounties
  WHERE id = p_bounty_id AND status = 'live';
  
  IF v_max_hunters IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Bounty not found or not live'
    );
  END IF;
  
  -- Check if slots available
  SELECT COUNT(*) INTO v_current_hunters
  FROM hunter_stakes
  WHERE bounty_id = p_bounty_id AND status = 'active';
  
  IF v_current_hunters >= v_max_hunters THEN
    RETURN json_build_object(
      'success', false,
      'error', 'All hunter slots are filled'
    );
  END IF;
  
  -- Check hunter balance
  SELECT wallet_balance INTO v_hunter_balance
  FROM profiles
  WHERE id = p_hunter_id;
  
  IF v_hunter_balance < p_entry_fee THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Insufficient balance'
    );
  END IF;
  
  -- Deduct entry fee from hunter wallet
  UPDATE profiles
  SET wallet_balance = wallet_balance - p_entry_fee,
      total_spent = total_spent + p_entry_fee
  WHERE id = p_hunter_id;
  
  -- Create stake record
  INSERT INTO hunter_stakes (hunter_id, bounty_id, entry_fee, status)
  VALUES (p_hunter_id, p_bounty_id, p_entry_fee, 'active');
  
  -- Create transaction record
  INSERT INTO transactions (user_id, bounty_id, type, amount, currency, status)
  VALUES (p_hunter_id, p_bounty_id, 'stake', p_entry_fee, 'INR', 'approved');
  
  RETURN json_build_object(
    'success', true,
    'message', 'Successfully staked on bounty'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 2: Submit Work
CREATE OR REPLACE FUNCTION submit_work(
  p_bounty_id UUID,
  p_hunter_id UUID,
  p_submission_url TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_has_stake BOOLEAN;
  v_ai_score INTEGER;
  v_submission_id UUID;
BEGIN
  -- Check if hunter has active stake
  SELECT EXISTS (
    SELECT 1 FROM hunter_stakes
    WHERE hunter_id = p_hunter_id
      AND bounty_id = p_bounty_id
      AND status = 'active'
  ) INTO v_has_stake;
  
  IF NOT v_has_stake THEN
    RETURN json_build_object(
      'success', false,
      'error', 'You must stake on this bounty before submitting'
    );
  END IF;
  
  -- Generate mock AI score (60-95)
  v_ai_score := 60 + floor(random() * 36)::INTEGER;
  
  -- Create submission (UPDATE if exists, INSERT if new)
  INSERT INTO submissions (hunter_id, bounty_id, submission_url, notes, ai_score)
  VALUES (p_hunter_id, p_bounty_id, p_submission_url, p_notes, v_ai_score)
  ON CONFLICT (hunter_id, bounty_id)
  DO UPDATE SET
    submission_url = p_submission_url,
    notes = p_notes,
    ai_score = v_ai_score,
    submitted_at = NOW()
  RETURNING id INTO v_submission_id;
  
  RETURN json_build_object(
    'success', true,
    'submission_id', v_submission_id,
    'ai_score', v_ai_score
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 3: Select Winner
CREATE OR REPLACE FUNCTION select_winner(
  p_bounty_id UUID,
  p_winner_id UUID,
  p_selector_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_payer_id UUID;
  v_vault_amount NUMERIC;
  v_currency TEXT;
BEGIN
  -- Get bounty details
  SELECT payer_id, vault_amount, currency INTO v_payer_id, v_vault_amount, v_currency
  FROM bounties
  WHERE id = p_bounty_id;
  
  -- Verify selector is payer or admin
  IF p_selector_id != v_payer_id AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = p_selector_id AND role = 'admin'
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Only payer or admin can select winner'
    );
  END IF;
  
  -- Mark submission as winner
  UPDATE submissions
  SET selected_as_winner = true
  WHERE bounty_id = p_bounty_id AND hunter_id = p_winner_id;
  
  -- Update bounty status
  UPDATE bounties
  SET status = 'completed',
      winner_id = p_winner_id,
      completed_at = NOW()
  WHERE id = p_bounty_id;
  
  -- Transfer vault to winner
  UPDATE profiles
  SET wallet_balance = wallet_balance + v_vault_amount,
      total_earnings = total_earnings + v_vault_amount,
      hunts_completed = hunts_completed + 1,
      hunts_won = hunts_won + 1
  WHERE id = p_winner_id;
  
  -- Update success rate
  UPDATE profiles
  SET success_rate = (hunts_won::NUMERIC / NULLIF(hunts_completed, 0)) * 100
  WHERE id = p_winner_id;
  
  -- Create payout transaction
  INSERT INTO transactions (user_id, bounty_id, type, amount, currency, status)
  VALUES (p_winner_id, p_bounty_id, 'payout', v_vault_amount, v_currency, 'approved');
  
  -- Update other stakes as 'lost'
  UPDATE hunter_stakes
  SET status = 'lost'
  WHERE bounty_id = p_bounty_id AND hunter_id != p_winner_id;
  
  -- Update winner stake as 'won'
  UPDATE hunter_stakes
  SET status = 'won'
  WHERE bounty_id = p_bounty_id AND hunter_id = p_winner_id;
  
  -- PURGE WAR ROOM MESSAGES
  DELETE FROM war_room_messages WHERE bounty_id = p_bounty_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Winner selected and rewarded'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 4: Verify Deposit
CREATE OR REPLACE FUNCTION verify_deposit(
  p_transaction_id UUID,
  p_admin_id UUID,
  p_approved BOOLEAN,
  p_admin_notes TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_amount NUMERIC;
  v_currency TEXT;
BEGIN
  -- Verify admin role
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = p_admin_id AND role = 'admin'
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Only admins can verify deposits'
    );
  END IF;
  
  -- Get transaction details
  SELECT user_id, amount, currency INTO v_user_id, v_amount, v_currency
  FROM transactions
  WHERE id = p_transaction_id AND type = 'deposit' AND status = 'pending';
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Transaction not found or already processed'
    );
  END IF;
  
  IF p_approved THEN
    -- Add to user wallet
    UPDATE profiles
    SET wallet_balance = wallet_balance + v_amount
    WHERE id = v_user_id;
    
    -- Update transaction status
    UPDATE transactions
    SET status = 'approved',
        admin_notes = p_admin_notes,
        processed_at = NOW()
    WHERE id = p_transaction_id;
    
    RETURN json_build_object(
      'success', true,
      'message', 'Deposit approved and credited'
    );
  ELSE
    -- Reject
    UPDATE transactions
    SET status = 'rejected',
        admin_notes = p_admin_notes,
        processed_at = NOW()
    WHERE id = p_transaction_id;
    
    RETURN json_build_object(
      'success', true,
      'message', 'Deposit rejected'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 5: Request Withdrawal
CREATE OR REPLACE FUNCTION request_withdrawal(
  p_user_id UUID,
  p_amount NUMERIC,
  p_upi_id TEXT
)
RETURNS JSON AS $$
DECLARE
  v_balance NUMERIC;
  v_currency TEXT;
  v_transaction_id UUID;
BEGIN
  -- Get user balance
  SELECT wallet_balance, currency INTO v_balance, v_currency
  FROM profiles
  WHERE id = p_user_id;
  
  IF v_balance < p_amount THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Insufficient balance'
    );
  END IF;
  
  -- Deduct from wallet (held in escrow)
  UPDATE profiles
  SET wallet_balance = wallet_balance - p_amount
  WHERE id = p_user_id;
  
  -- Create withdrawal transaction
  INSERT INTO transactions (user_id, type, amount, currency, utr, status)
  VALUES (p_user_id, 'withdrawal', p_amount, v_currency, p_upi_id, 'pending')
  RETURNING id INTO v_transaction_id;
  
  RETURN json_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'message', 'Withdrawal request submitted for admin approval'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- SETUP COMPLETE
-- ================================================

-- Create a test admin user (CHANGE EMAIL TO YOUR ACTUAL ADMIN EMAIL)
-- INSERT INTO profiles (id, email, role, username, nationality, currency, accepted_covenant)
-- VALUES (
--   'PASTE_YOUR_ADMIN_USER_UUID_HERE',
--   'admin@iqhunt.com',
--   'admin',
--   'admin',
--   'india',
--   'INR',
--   true
-- );
