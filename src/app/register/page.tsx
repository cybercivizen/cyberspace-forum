"use client";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/src/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";
import React from "react";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { seedUser } from "./actions";

const FormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    dateOfBirth: z.date("Invalid date of birth"),
    accountType: z.enum(["npc", "rgb", "dog"], "No account type selected"),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormInput = z.infer<typeof FormSchema>;

export default function RegisterPage() {
  const [openCalendar, setOpenCalendar] = React.useState(false);

  const accountTypes = ["Admin", "User"];
  const { handleSubmit, control, reset } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: undefined,
      accountType: undefined,
      termsAccepted: false,
    },
  });

  function onSubmit(data: FormInput) {
    console.log(data);
    // Handle registration logic here
  }

  async function onReset() {
    reset();
    await seedUser();
  }

  return (
    <Card className="w-2/4 m-auto z-10">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Create a new <span className="font-mono">TERMINAL</span> account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
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
                <Controller
                  name="accountType"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Account Type</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Types</SelectLabel>
                            {accountTypes.map((type) => (
                              <SelectItem key={type} value={type.toLowerCase()}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <Controller
                name="termsAccepted"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    className="items-center"
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      name={field.name}
                    />
                    <FieldLabel>I agree to the Terms and Conditions</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="justify-end gap-4">
          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
          <Button type="submit" form="register-form">
            Register
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
