import React, { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  // Already logged in → replace history taaki back button login pe na laaye
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.isApproved) navigate("/generator", { replace: true });
      else navigate("/pending", { replace: true });
    }
  }, [navigate]);

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/google-login`,
        { credential: credentialResponse.credential },
      );

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.isApproved) navigate("/generator", { replace: true });
      else navigate("/pending", { replace: true });
    } catch (error) {
      console.error("Login Error", error);
      alert("Login failed! Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-soft-bg)] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-[var(--shadow-neu)] flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2">DocStudio</h1>
        <p className="text-gray-500 mb-8 text-sm text-center max-w-xs">
          Welcome back! Please login with your Google account to continue.
        </p>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login Failed")}
          useOneTap
          theme="filled_black"
          shape="pill"
        />
      </div>
    </div>
  );
}
