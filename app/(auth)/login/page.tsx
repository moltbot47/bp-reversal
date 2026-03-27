"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const isVerify = searchParams.get("verify") === "true";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(isVerify);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("resend", { email, redirect: false });
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#EEEFE9] flex items-center justify-center p-4">
        <div className="bg-[#FDFDF8] rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1D2939] mb-2">
            Check your email
          </h1>
          <p className="text-[#667085] mb-6">
            We sent a magic link to <strong>{email || "your email"}</strong>.
            Click the link to sign in.
          </p>
          <p className="text-sm text-[#667085]">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button
              onClick={() => setSent(false)}
              className="text-[#EB9D2A] font-medium hover:underline"
            >
              try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEEFE9] flex items-center justify-center p-4">
      <div className="bg-[#FDFDF8] rounded-xl shadow-sm p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1D2939] mb-2">
            BP Reversal
          </h1>
          <p className="text-[#667085]">
            Sign in to track your 90-day protocol
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#1D2939] mb-1"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667085]" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-[#1D2939] placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#EB9D2A] focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#EB9D2A] text-white font-semibold rounded-lg shadow-[0_2px_0_0_#C4800F] hover:bg-[#D4891F] active:translate-y-[1px] active:shadow-[0_1px_0_0_#C4800F] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              "Sending magic link..."
            ) : (
              <>
                Sign in with email
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#667085] mt-6">
          No password needed. We&apos;ll send you a magic link.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EEEFE9] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#EB9D2A] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
