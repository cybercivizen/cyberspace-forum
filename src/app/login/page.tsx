import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="w-2/4 m-auto z-10">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Don&apos;t have an an account?
          <a href="/register" className="text-primary font-mono">
            {" "}
            Register now
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>FORM HERE</CardContent>
    </Card>
  );
}
