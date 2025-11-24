import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";

import {
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import { getSession } from "@/src/lib/session";
import Image from "next/image";
import { Controller } from "react-hook-form";

export default async function ProfilePage() {
  const session = await getSession();
  const username = (session?.username as string) || "Guest"; // Fallback if no session

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
              <div className="text-xl font-medium text-white ml-4 font-mono">
                {username}
              </div>
              <Button className="ml-4">Change Picture</Button>
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
        <CardContent></CardContent>
        <CardFooter>
          {/* <Button type="submit" form="login-form" className="w-full">
          Login
        </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}
