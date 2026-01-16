// "use client";

// import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

// const Page = () => {
//   console.log("Sign up page");
//   return <SignUpView />;
// };

// export default Page;

// //http://localhost:3000/sign-up
// //http://localhost:3000/sign-in

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If already logged in → go home
  if (session) {
    redirect("/");
  }

  return <SignUpView />;
};

export default Page;
