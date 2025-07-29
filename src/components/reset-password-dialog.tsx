import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { MikuLoader } from "@/components/ui/miku-loader";

export function ResetDialog() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-center w-full underline cursor-pointer">
          Forgot Password
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogDescription>
            Please enter your email address to reset your password.
          </DialogDescription>
        </DialogHeader>
        {!success ? (
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Email</Label>
              <Input
                id="name-1"
                name="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-green-500">
            <p className="text-sm">
              A password reset link has been sent to your email address.
            </p>
          </div>
        )}
        <DialogFooter>
          {!success ? (
            <>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={async () => {
                  await authClient.requestPasswordReset(
                    {
                      email: email,
                      redirectTo: "/reset-password",
                    },
                    {
                      onRequest: () => {
                        setLoading(true);
                      },
                      onError: (ctx) => {
                        setLoading(false);
                        toast.error(ctx.error.message);
                      },
                      onSuccess: () => {
                        toast.success("Password reset link sent to your email");
                        setSuccess(true);
                        setLoading(false);
                      },
                    }
                  );
                }}
                disabled={loading}
              >
                {loading ? <MikuLoader size={20} text="" /> : "Send Reset Link"}
              </Button>
            </>
          ) : (
            <DialogClose asChild>
              <Button onClick={() => setSuccess(false)} className="mx-auto">
                Ok
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
