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
import Image from "next/image";
import { Controller } from "react-hook-form";

export default function ProfilePage() {
  return (
    <div className="flex justify-center items-center h-full w-[80%] gap-20">
      <Card className="flex-1  m-auto z-10 h-[80%] bg-black/50">
        <CardHeader>
          <CardTitle className="text-2xl">Profile</CardTitle>
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
            <div className="flex-col gap-6">
              <div className="text-xl font-medium text-white ml-4">
                Cyberdog
              </div>
              <Button className="ml-4">Change Picture</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="flex-2 m-auto z-10 h-[80%] bg-black/50">
        <CardHeader>
          <CardTitle className="text-2xl">Infos</CardTitle>
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
