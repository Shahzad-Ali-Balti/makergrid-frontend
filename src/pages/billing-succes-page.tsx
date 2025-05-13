// pages/billing-success.tsx

import { useEffect } from "react";
import { useLocation } from "wouter";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/hooks/use-auth";
import {Loader2} from "lucide-react"
const BillingSuccessPage:React.FC = () => {
  const [location, navigate] = useLocation();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("session_id");

    if (sessionId) {
      axiosInstance
        .get(`/api/accounts/stripe/validate-session/${sessionId}/`)
        .then(() => {
          refreshUser();
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("❌ Validation error:", err);
          navigate("/dashboard");
        });
    }
  }, [location]);

  return (
    <div className="flex items-center justify-center h-screen text-white">
    <Loader2 className="h-8 w-8 animate-spin" />
      Finalizing your subscription...
    </div>
  );
};

export default BillingSuccessPage;
