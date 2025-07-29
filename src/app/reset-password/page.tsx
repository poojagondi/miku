"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function ResetPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg border p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-destructive">
            Invalid Token
          </h1>
          <p className="text-center text-gray-600">
            The password reset link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg border p-8 shadow-lg">
          <span className="mb-6 block text-center text-xl font-semibold text-green-700">
            Password set successfully
          </span>
          <Button
            className="w-full"
            onClick={(e) => {
              router.push("/sign-in");
            }}
          >
            Return to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Set New Password
        </h1>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="New Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            onChange={(e) => {
              setconfirmPassword(e.target.value);
            }}
          />
          <Button
            className="w-full"
            disabled={loading}
            onClick={async () => {
              if (password !== confirmPassword) {
                setError("Passwords dont match");
              } else {
                setLoading(true);
                const { data, error } = await authClient.resetPassword({
                  newPassword: password,
                  token,
                });

                if (error) {
                  console.log(error);
                  setError(error.message || "");
                }
                if (data) {
                  //router.push("/sign-in");
                }
                setLoading(false);
                setSuccess(true);
              }
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Setting password...
              </span>
            ) : (
              "Set Password"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ResetPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPage />
    </Suspense>
  );
}
