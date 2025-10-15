import React from 'react';
import { supabase } from '../supabaseClient';

export default function Login() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: import.meta.env.VITE_REDIRECT_URL,
      },
    });
  };

  return (
    <div className="login-page">
      <button onClick={handleLogin} className="bg-red-600 text-white px-4 py-2 rounded">
        Login with Discord
      </button>
    </div>
  );
}
