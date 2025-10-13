-- Create enum for server types
CREATE TYPE server_type AS ENUM ('minecraft', 'bot');

-- Create enum for server status
CREATE TYPE server_status AS ENUM ('active', 'suspended', 'expired');

-- Create servers table
CREATE TABLE public.servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  server_type server_type NOT NULL,
  plan_name TEXT NOT NULL,
  ram TEXT NOT NULL,
  cpu TEXT NOT NULL,
  disk TEXT NOT NULL,
  max_players TEXT,
  cost_points INTEGER NOT NULL,
  status server_status DEFAULT 'active',
  console_email TEXT,
  console_password TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own servers"
ON public.servers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own servers"
ON public.servers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own servers"
ON public.servers FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_servers_updated_at
BEFORE UPDATE ON public.servers
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create function to deduct points and create server
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
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_current_points INTEGER;
  v_server_id UUID;
  v_console_email TEXT;
  v_console_password TEXT;
BEGIN
  -- Get user id
  v_user_id := auth.uid();
  
  -- Get current points
  SELECT points INTO v_current_points
  FROM public.profiles
  WHERE id = v_user_id;
  
  -- Check if user has enough points
  IF v_current_points < p_cost_points THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;
  
  -- Generate console credentials
  v_console_email := v_user_id || '@welderhosting.com';
  v_console_password := encode(gen_random_bytes(12), 'base64');
  
  -- Create server
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
  
  -- Deduct points
  UPDATE public.profiles
  SET points = points - p_cost_points
  WHERE id = v_user_id;
  
  RETURN v_server_id;
END;
$$;