
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FolderKanban,
  CircleDollarSign,
  Package,
  MessageSquare,
  Settings,
  LogOut,
  Warehouse,
  Users,
  UserCog,
  Receipt,
  FileText,
  CreditCard,
  Contact,
  Folder,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/auth-context';

const mainNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
];

const accountingNavItems = [
  { href: '/invoices', label: 'Invoices', icon: Receipt },
  { href: '/estimates', label: 'Estimates', icon: FileText },
  { href: '/expenses', label: 'Expenses', icon: CreditCard },
  { href: '/clients', label: 'Clients', icon: Contact },
];

const secondaryNavItems = [
  { href: '/documents', label: 'Documents', icon: Folder },
  { href: '/messaging', label: 'Messaging', icon: MessageSquare },
  { href: '/accounting', label: 'Old Accounting', icon: CircleDollarSign },
];

const adminNavItems = [
  { href: '/employees', label: 'Employees', icon: UserCog },
  { href: '/hr', label: 'HR', icon: Users },
  { href: '/packages', label: 'My Packages', icon: Package },
];

export function SiteSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  }

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <Button variant="ghost" className="w-full justify-start gap-2 px-2 text-lg h-12" asChild>
          <Link href="/">
            <Warehouse className="size-6 text-primary" />
            <span className="font-bold">WareFlow</span>
          </Link>
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarGroup>
           <SidebarGroupLabel>Accounting</SidebarGroupLabel>
           <SidebarMenu>
             {accountingNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
           </SidebarMenu>
        </SidebarGroup>
         <SidebarMenu>
          {secondaryNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {user?.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={{ children: item.label, side: 'right' }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: 'Settings', side: 'right' }}>
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip={{ children: 'Logout', side: 'right' }}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
