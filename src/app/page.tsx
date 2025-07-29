import { redirect } from "next/navigation";

export default async function page() {
  // Redirect root to home page
  redirect("/home");
}
