import SignIn from "@/components/sign-in";
import SignUp from "@/components/sign-up";

export default function AuthPage() {
  return (
    <div className="h-screen flex items-center container w-full justify-center flex-col p-4">
      <h1 className="text-2xl font-bold">Authentication Page</h1>
      <SignIn />
      <SignUp />
    </div>
  );
}
