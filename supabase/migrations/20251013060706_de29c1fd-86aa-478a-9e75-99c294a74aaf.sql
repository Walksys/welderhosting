-- Fix search_path for purchase_server function
DROP FUNCTION IF EXISTS public.purchase_server(server_type, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER);

CREATE OR REPLACE FUNCTION public.purchase_server(
  p_server_type server_type,
  p_plan_name TEXT,
  p_ram TEXT,
  p_cpu TEXT,
  p_disk TEXT,
  p_max_players TEXT,
  p_cost_points INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_current_points INTEGER;
  v_server_id UUID;
  v_console_email TEXT;
  v_console_password TEXT;
BEGIN
  v_user_id := auth.uid();
  
  SELECT points INTO v_current_points
  FROM public.profiles
  WHERE id = v_user_id;
  
  IF v_current_points < p_cost_points THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;
  
  v_console_email := v_user_id || '@welderhosting.com';
  v_console_password := encode(gen_random_bytes(12), 'base64');
  
  INSERT INTO public.servers (
    user_id,
    server_type,
    plan_name,
    ram,
    cpu,
    disk,
    max_players,
    cost_points,
    console_email,
    console_password,
    expires_at
  ) VALUES (
    v_user_id,
    p_server_type,
    p_plan_name,
    p_ram,
    p_cpu,
    p_disk,
    p_max_players,
    p_cost_points,
    v_console_email,
    v_console_password,
    now() + INTERVAL '30 days'
  )
  RETURNING id INTO v_server_id;
  
  UPDATE public.profiles
  SET points = points - p_cost_points
  WHERE id = v_user_id;
  
  RETURN v_server_id;
END;
$$;