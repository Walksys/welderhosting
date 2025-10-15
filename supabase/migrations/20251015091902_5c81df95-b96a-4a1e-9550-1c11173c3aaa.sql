-- Create or update the trigger function to handle new Discord users
CREATE OR REPLACE FUNCTION public.handle_new_discord_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile for Discord OAuth users
  INSERT INTO public.profiles (
    id,
    discord_id,
    username,
    avatar,
    points,
    last_point_update
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'provider_id',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    NEW.raw_user_meta_data->>'avatar_url',
    0,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    discord_id = COALESCE(EXCLUDED.discord_id, profiles.discord_id),
    username = COALESCE(EXCLUDED.username, profiles.username),
    avatar = COALESCE(EXCLUDED.avatar, profiles.avatar);
  
  RETURN NEW;
END;
$$;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_discord_user();