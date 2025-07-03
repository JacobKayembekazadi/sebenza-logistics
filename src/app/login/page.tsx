
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Warehouse className="size-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Log In to WareFlow</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
            <LoginForm />
            <p className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="underline hover:text-primary">
                    Sign up
                </Link>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
