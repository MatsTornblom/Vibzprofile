/*
  # Fix increment_vibz_balance function overload issue

  1. Changes
    - Drop existing increment_vibz_balance functions to avoid overload ambiguity
    - Recreate a single, unambiguous function that accepts integer amount
    - Uses SECURITY DEFINER to bypass RLS safely

  2. Purpose
    - Resolves "Could not choose the best candidate function" error
    - Ensures only one function signature exists
*/

DROP FUNCTION IF EXISTS increment_vibz_balance(uuid, integer);
DROP FUNCTION IF EXISTS increment_vibz_balance(uuid, numeric);

CREATE FUNCTION increment_vibz_balance(
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