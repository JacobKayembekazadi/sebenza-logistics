
'use client';

import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/layout/header';
import { SiteSidebar } from '@/components/layout/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { DataProvider } from '@/contexts/data-context';
import { AuthProvider } from '@/contexts/auth-context';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const noLayoutPages = ['/', '/login', '/signup'];
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


    if (noLayoutPages.includes(pathname)) {
        return <>{children}</>;
    }

    if (!isClient) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <SidebarProvider>
            <SiteSidebar />
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <SiteHeader />
                    <div className="flex-1 p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <title>Sebenza Logistics Suite</title>
        <meta name="description" content="SaaS platform for logistics and warehouse management." />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <DataProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
