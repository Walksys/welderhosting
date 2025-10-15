"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // لو فيه access token في الرابط
      const hash = window.location.hash;
      if (hash.includes("access_token")) {
        const params = new URLSearchParams(hash.substring(1));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (access_token && refresh_token) {
          // خزّن التوكن في Supabase session
          await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          // بعدين ودّيه للداشبورد
          router.push("/dashboard");
        }
      }
    };
    handleAuthCallback();
  }, [router, supabase]);

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Logging you in...</h1>
        <p>Please wait while we complete authentication with Discord.</p>
      </div>
    </div>
  );
}
