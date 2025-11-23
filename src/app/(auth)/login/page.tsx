"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z, { email, string } from "zod";
import React from "react";
import { useRouter } from "next/navigation";
import { login } from "@/src/lib/auth";

const FormSchema = z.object({
  email: email("Invalid email address").trim().toLowerCase(),
  password: string().min(6, "Password must be at least 6 characters"),
});

type FormInput = z.infer<typeof FormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loginMessage, setLoginMessage] = React.useState("");

  const { handleSubmit, control, setError } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onLogin(data: FormInput) {
    const result = await login(data);
    if (!result.success) {
      if (result.errors?.email) {
        setError("email", {
          type: "manual",
          message: result.errors.email,
        });
      }

      if (result.errors?.password) {
        setError("password", {
          type: "manual",
          message: result.errors.password,
        });
      }
    } else {
      setLoginMessage("SUCCESSFULLY LOGGED IN");
      router.replace("/");
    }
  }

  return (
    <Card className="w-1/4 m-auto z-10">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Don&apos;t have an an account?
          <a href="/signup" className="text-primary font-mono">
            {" "}
            Signup now
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit(onLogin)}>
          <FieldSet>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter your email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldSet>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="login-form" className="w-full">
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
