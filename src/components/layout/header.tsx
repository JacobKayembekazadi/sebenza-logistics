
'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useAuth } from '@/contexts/auth-context';
import type { User } from '@/contexts/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const defaultAdminUser: User = {
  name: 'Admin User',
  email: 'admin@wareflow.com',
  avatar: 'https://placehold.co/100x100.png',
  role: 'admin',
};

export function SiteHeader() {
  const { user, login, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-card/95 backdrop-blur-sm border-b">
      <div className="flex h-16 items-center px-4 md:px-6 lg:px-8">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        <div className="hidden md:flex flex-1">
          {/* Can add breadcrumbs here */}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} data-ai-hint="person portrait" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className='w-56'>
                <DropdownMenuLabel>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <Link href="/billing">Billing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button onClick={() => login(defaultAdminUser)}>
                <LogIn className="mr-2 h-4 w-4" />
                Log In
             </Button>
          )}
        </div>
      </div>
    </header>
  );
}
