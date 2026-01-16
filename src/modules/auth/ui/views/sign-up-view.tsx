"use client";

import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";

/* ---------------- Schema ---------------- */
const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof formSchema>;
const fields: Array<keyof FormValues> = [
  "name",
  "email",
  "password",
  "confirmPassword",
];

/* ---------------- Component ---------------- */
export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (data: FormValues) => {
    if (pending) return;
    setError(null);
    setPending(true);

    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error?.message ?? "Something went wrong");
        },
      }
    );
  };

  const onSocial = (provider: "google" | "github") => {
    if (pending) return;
    setError(null);
    setPending(true);

    authClient.signIn.social(
      { provider, callbackURL: "/" },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error?.message ?? "Something went wrong");
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-10 space-y-6 bg-white"
            >
              <div className="text-center">
                <h1 className="text-2xl font-bold">Let’s get started</h1>
                <p className="text-muted-foreground">Create your account</p>
              </div>

              {fields.map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {fieldName
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (s) => s.toUpperCase())}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={
                            fieldName.includes("password")
                              ? "password"
                              : fieldName === "email"
                              ? "email"
                              : "text"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {!!error && (
                <Alert variant="destructive">
                  <OctagonAlertIcon className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Creating account..." : "Sign up"}
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  disabled={pending}
                  onClick={() => onSocial("google")}
                  className="w-full"
                >
                  <FaGoogle />
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={pending}
                  onClick={() => onSocial("github")}
                  className="w-full"
                >
                  <FaGithub />
                </Button>
              </div>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/sign-in" className="underline">
                  Sign in
                </Link>
              </div>
            </form>
          </Form>

          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-green-700 via-green-300 to-green-100">
            <div className="text-center space-y-4">
              <img src="/logo.svg" className="mx-auto h-24 w-24" />
              <p className="text-2xl font-semibold text-green-900">Meet.AI</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
