import AuthForm from "@/components/AuthForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

function LoginPage() {
  return (
    <div className="mt-20 flex flex-1 flex-col items-center gap-6 max-sm:mx-auto max-sm:max-w-sm">
      <Link href="/">
        <h1 className="text-5xl font-semibold">nota</h1>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="mb-1">
          <CardTitle className="text-center text-3xl">Login</CardTitle>
        </CardHeader>
        <AuthForm type="login" />
      </Card>
    </div>
  );
}

export default LoginPage;
