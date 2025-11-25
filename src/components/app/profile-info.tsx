"use client";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Separator } from "@/src/components/ui/separator";
import { getSession } from "@/src/lib/auth/session";
import Image from "next/image";
import React from "react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const FormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .trim(),
    email: z.email("Invalid email address").trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    dateOfBirth: z.date("Invalid date of birth"),
    role: z.enum(["admin", "user"], "No account role selected"),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormInput = z.infer<typeof FormSchema>;

export default function ProfileInfo({ username }: { username: string }) {
  const [openCalendar, setOpenCalendar] = React.useState(false);

  const { handleSubmit, control, reset, setError } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: undefined,
      role: "user",
      termsAccepted: false,
    },
  });

  return (
    <div className="flex justify-center items-center h-full w-[80%] gap-20">
      <Card className="flex-1  m-auto z-10 h-[80%] bg-black/50">
        <CardHeader>
          <CardTitle className="text-2xl opacity-90">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <Image
              src={"/profile-pic.jpg"}
              className="rounded-full"
              alt={"Avatar"}
              width={70}
              height={70}
            ></Image>
            <div className="flex flex-col gap-6">
              <div className="text-2xl text-white ml-4 font-mono">
                {username}
              </div>
              <Button variant="outline" className="ml-4">
                Change Picture
              </Button>
            </div>
          </div>
          <Separator className="my-8" />
          <CardTitle className="text-2xl opacity-90">Joined Groups</CardTitle>
        </CardContent>
      </Card>
      <Card className="flex-2 m-auto z-10 h-[80%] bg-black/50">
        <CardHeader>
          <CardTitle className="text-2xl opacity-90">Infos</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldSet>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="username"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Username</FieldLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your username"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
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
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Confirm Password</FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm password"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Date of Birth</FieldLabel>
                      <Popover
                        open={openCalendar}
                        onOpenChange={setOpenCalendar}
                      >
                        <PopoverTrigger asChild>
                          <div>
                            <Input
                              className="text-left"
                              id="date"
                              aria-invalid={fieldState.invalid}
                              value={
                                field.value
                                  ? field.value.toLocaleDateString()
                                  : ""
                              }
                              onChange={field.onChange}
                              placeholder="MM/DD/YYYY"
                              readOnly
                            />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden"
                          align="start"
                        >
                          <Calendar
                            {...field}
                            mode="single"
                            captionLayout="dropdown"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setOpenCalendar(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldSet>
            <FieldSeparator />
          </FieldGroup>
        </CardContent>
        <CardFooter>{/* */}</CardFooter>
      </Card>
    </div>
  );
}
