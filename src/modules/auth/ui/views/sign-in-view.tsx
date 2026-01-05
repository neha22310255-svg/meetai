"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Zod schema
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const SignInView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* LEFT — FORM */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-8 space-y-6 bg-white"
            >
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back
                </h1>
                <p className="text-muted-foreground">Login to your account</p>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ERROR */}
              {!!error && (
                <Alert className="bg-destructive/10 border-none">
                  <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}

              {/* DIVIDER */}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t">
                <span className="relative z-10 bg-white px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              {/* SOCIAL */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  disabled={pending}
                  variant="outline"
                  type="button"
                  className="w-full"
                >
                  Google
                </Button>

                <Button
                  disabled={pending}
                  variant="outline"
                  type="button"
                  className="w-full"
                >
                  GitHub
                </Button>
              </div>

              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>

          {/* RIGHT — GRADIENT */}
          <div className="relative hidden md:flex flex-col gap-y-4 items-center justify-center bg-gradient-to-br from-green-700 via-green-200 to-green-100">
            <img src="/logo.svg" alt="Logo" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-green-900">Meet.AI</p>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4">
          Privacy Policy
        </a>
      </div>
    </div>
  );
};
