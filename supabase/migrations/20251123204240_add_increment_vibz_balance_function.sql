/*
  # Add increment_vibz_balance RPC function

  1. New Functions
    - `increment_vibz_balance` - Safely increments a user's VIBZ balance by a specified amount
      - Parameters:
        - `user_id` (uuid) - The ID of the user
        - `amount` (integer) - The amount to add to the balance
      - Returns: void
      - Security: Function runs with SECURITY DEFINER to bypass RLS

  2. Purpose
    - Provides a safe way to increment VIBZ balance without exposing direct UPDATE permissions
    - Ensures atomic operations on the balance field
    - Validates that the user exists before updating
*/

CREATE OR REPLACE FUNCTION increment_vibz_balance(
  user_id uuid,
  amount integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users
  SET vibz_balance = COALESCE(vibz_balance, 0) + amount
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;