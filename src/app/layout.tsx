
'use client';

import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/layout/header';
import { SiteSidebar } from '@/components/layout/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { DataProvider } from '@/contexts/data-context';
import { AuthProvider } from '@/contexts/auth-context';
import { usePathname } from 'next/navigation';

function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const noLayoutPages = ['/', '/login', '/signup'];

    if (noLayoutPages.includes(pathname)) {
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
            <SiteSidebar />
            <SidebarInset>
                <div className="flex flex-col h-full">
                    <SiteHeader />
                    <main className="flex-1 p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
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
        <title>WareFlow</title>
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
