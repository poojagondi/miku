import SignIn from "@/components/sign-in";
import SignUp from "@/components/sign-up";

export default function AuthPage() {
  return (
    <div className="min-h-[100svh] flex items-center container w-full justify-center flex-col p-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Authentication Page</h1>
      <SignIn />
      <SignUp />
    </div>
  );
}
