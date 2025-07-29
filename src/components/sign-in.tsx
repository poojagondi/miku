"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2, Key } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ResetDialog } from "./reset-password-dialog";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>

            <Input
              id="password"
              type="password"
              placeholder="password"
              autoComplete="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              await signIn.email(
                {
                  email,
                  password,
                },
                {
                  onRequest: (ctx) => {
                    setLoading(true);
                  },
                  onError: (ctx) => {
                    setLoading(false);
                    if (ctx.error) {
                      const errorMessage = ctx.error.message;
                      toast.error(errorMessage || "Failed to sign in");
                      return;
                    }
                    toast.error("Failed to sign in");
                  },
                  onSuccess: (ctx) => {
                    setLoading(false);
                    toast.success("Signed in successfully");

                    // Check if this is a first-time login by checking if user has any notes
                    // For simplicity, we'll redirect new users to welcome page
                    // You can enhance this logic based on user creation date or other factors
                    const isNewUser =
                      ctx.data?.user?.createdAt &&
                      new Date(ctx.data.user.createdAt).getTime() >
                        Date.now() - 60000; // Created within last minute

                    if (isNewUser) {
                      router.push("/welcome");
                    } else {
                      router.push("/enter");
                    }
                    return;
                  },
                }
              );
            }}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Image
                  src="/mikuuu.png"
                  alt="Miku"
                  width={16}
                  height={16}
                  className="animate-pulse"
                />
                <span>...</span>
              </div>
            ) : (
              <p> Login </p>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <ResetDialog />
        <Link className="underline" href={"/sign-up"}>
          Sign Up
        </Link>
      </CardFooter>
    </Card>
  );
}
