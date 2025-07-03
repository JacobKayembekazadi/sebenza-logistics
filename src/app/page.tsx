
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Warehouse } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const { user, company } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && company) {
      router.replace('/dashboard');
    }
  }, [user, company, router]);

  if (user && company) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-sm mx-4">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <Warehouse className="size-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Welcome to WareFlow</CardTitle>
                <CardDescription>Your all-in-one logistics solution.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Button asChild>
                    <Link href="/login">Log In</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
