"use client";
import { useState, useId } from "react"; // Add useId
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";

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

import { Separator } from "@/src/components/ui/separator";
import { createSession } from "@/src/lib/auth/session";
import Image from "next/image";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { iso, z } from "zod";
import { SessionData, UserProfile } from "@/src/lib/types";
import { toast } from "sonner";
import { modifyUser } from "@/src/lib/repositories/user-repository";
import { useUploadThing } from "@/src/lib/utils";
import { Camera } from "lucide-react"; // or any icon library
import { useRouter } from "next/navigation";
import { Resend } from "resend";
import { sendEmail } from "@/src/app/profile/actions";

const FormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .trim(),
  email: z.email("Invalid email address").trim().toLowerCase(),
  dateOfBirth: z.date("Invalid date of birth"),
});

export type FormInput = z.infer<typeof FormSchema>;

export default function ProfileInfo({
  userProfile,
  isOwner,
}: {
  userProfile: UserProfile;
  isOwner: boolean;
}) {
  const router = useRouter();
  const popoverId = useId(); // Generate stable ID
  const [openCalendar, setOpenCalendar] = React.useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(
    userProfile.profilePictureUrl || "/avatar.png"
  );
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);

  const { username, email, dateOfBirth } = userProfile;

  const defaultFormValues: FormInput = {
    username: username,
    email: email,
    dateOfBirth: dateOfBirth,
  };

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isDirty, isValid },
  } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const { startUpload, isUploading } = useUploadThing("profilePicture", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        setProfilePicUrl(res[0].ufsUrl);
        router.refresh();
        toast.success("Profile picture updated!");
      }
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        // Validate minimum dimensions after image loads
        if (img.width < 100 || img.height < 100) {
          toast.error(
            `Image must be at least 100x100 pixels (current: ${img.width}x${img.height})`
          );
          e.target.value = ""; // Reset file input
          return;
        }
        setImgSrc(reader.result as string);
        setCropDialogOpen(true);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = async () => {
    if (!imgRef || !crop) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.naturalWidth / imgRef.width;
    const scaleY = imgRef.naturalHeight / imgRef.height;

    const size = Math.min(crop.width * scaleX, crop.height * scaleY);

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      imgRef,
      crop.x * scaleX,
      crop.y * scaleY,
      size,
      size,
      0,
      0,
      size,
      size
    );

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob!], "profile.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        resolve(file);
      }, "image/jpeg");
    });
  };

  const handleCropComplete = async () => {
    const croppedFile = await getCroppedImg();
    if (croppedFile) {
      await startUpload([croppedFile]);

      setCropDialogOpen(false);
    }
  };

  async function onSaveChanges(data: FormInput) {
    console.log("Saved data:", data);
    const result = await modifyUser(data, userProfile);
    if (!result.success && result.errors) {
      if (result.errors.username) {
        setError("username", {
          type: "manual",
          message: result.errors.username,
        });
      }
    } else {
      const newSessionData: SessionData = {
        userId: userProfile.id,
        username: data.username,
        email: userProfile.email,
        isAdmin: userProfile.rolesId === 2,
      };
      await createSession(newSessionData);
      toast.success("Changes has been saved succesfully!");
    }
  }

  function onReset() {
    reset();
  }

  const onChangeEmail = async () => {
    await sendEmail();
    toast.success("Confirmation email has been sent to your address.");
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center items-center h-full w-[80%] gap-20">
        <Card className="flex-1  m-auto z-10 h-[80%] bg-black/50 w-full">
          <CardHeader>
            <CardTitle className="text-2xl opacity-90">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="relative">
                <Image
                  src={userProfile.profilePictureUrl || "/default-avatar.png"}
                  className={`rounded-full ${
                    isUploading ? "opacity-50" : "opacity-100"
                  }`}
                  alt={"default-avatar"}
                  width={70}
                  height={70}
                />
                {isOwner && (
                  <>
                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-black" />
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </>
                )}
              </div>
              <div className="flex flex-col">
                <div className="text-2xl text-white font-mono">{username}</div>
                <div className="opacity-70">Hello, I am a user here!</div>
              </div>
            </div>
            <Separator className="my-8" />
            <CardTitle className="text-2xl opacity-90">Joined Groups</CardTitle>
          </CardContent>
        </Card>
        <Card className="flex-2 m-auto z-10 h-[80%] bg-black/50 w-full">
          <CardHeader>
            <CardTitle className="text-2xl opacity-90">Infos</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <form id="edit-profile-form" onSubmit={handleSubmit(onSaveChanges)}>
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
                            placeholder={username}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <div className="relative">
                        <Input type="text" placeholder={email} disabled />
                        <div
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground cursor-pointer underline"
                          onClick={onChangeEmail}
                        >
                          Change
                        </div>
                      </div>
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4 items-end">
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
                              <Input
                                className="text-left cursor-pointer"
                                id="date"
                                aria-invalid={fieldState.invalid}
                                value={
                                  field.value
                                    ? field.value.toLocaleDateString()
                                    : ""
                                }
                                onChange={field.onChange}
                                placeholder={dateOfBirth.toDateString()}
                                readOnly
                              />
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
                    <div className="flex gap-4 w-full justify-end">
                      <Button variant="outline" type="button" onClick={onReset}>
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        form="edit-profile-form"
                        disabled={!isDirty || !isValid}
                      >
                        Save changes
                      </Button>
                    </div>
                  </div>
                </FieldSet>

                <FieldSeparator />
              </FieldGroup>
            </form>
            <CardTitle className="text-2xl opacity-90 mt-8">Friends</CardTitle>
          </CardContent>
        </Card>
      </div>
      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="max-w-2xl" title="upload profile picture">
          <DialogTitle>Upload Profile Picture</DialogTitle>

          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={1}
            circularCrop
          >
            <img
              ref={setImgRef}
              src={imgSrc}
              alt="Crop preview"
              className="max-h-96"
            />
          </ReactCrop>
          <Button onClick={handleCropComplete} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
