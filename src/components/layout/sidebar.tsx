'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
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
} from 'lucide-react';
import { Button } from '../ui/button';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/accounting', label: 'Accounting', icon: CircleDollarSign },
  { href: '/packages', label: 'My Packages', icon: Package },
  { href: '/messaging', label: 'Messaging', icon: MessageSquare },
  { href: '/employees', label: 'Employees', icon: UserCog },
  { href: '/hr', label: 'HR', icon: Users },
];

export function SiteSidebar() {
  const pathname = usePathname();

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
          {navItems.map((item) => (
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
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: 'Settings', side: 'right' }}>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: 'Logout', side: 'right' }}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
