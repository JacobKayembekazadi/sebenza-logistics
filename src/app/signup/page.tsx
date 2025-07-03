
import { SignUpForm } from "@/components/auth/signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 py-12">
      <Card className="w-full max-w-md mx-4">
         <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Warehouse className="size-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create your WareFlow Account</CardTitle>
            <CardDescription>Fill out the form to get started.</CardDescription>
        </CardHeader>
        <CardContent>
            <SignUpForm />
            <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="underline hover:text-primary">
                    Log in
                </Link>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
