
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
  Briefcase,
  LineChart,
  ClipboardList,
  Truck,
  Archive,
  Calendar,
  Building2,
  ScrollText,
  Send,
  HandCoins,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/auth-context';

const mainNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
];

const accountingNavItems = [
  { href: '/invoices', label: 'Invoices', icon: Receipt },
  { href: '/estimates', label: 'Estimates', icon: FileText },
  { href: '/expenses', label: 'Expenses', icon: CreditCard },
  { href: '/clients', label: 'Clients', icon: Contact },
  { href: '/reporting', label: 'Reporting', icon: LineChart },
];

const logisticsNavItems = [
    { href: '/inventory', label: 'Inventory', icon: Package },
    { href: '/warehouses', label: 'Warehouses', icon: Building2 },
    { href: '/stock-transfers', label: 'Transfer History', icon: ScrollText },
    { href: '/money-transfers', label: 'Money Transfers', icon: Send },
    { href: '/purchase-orders', label: 'Purchase Orders', icon: ClipboardList },
    { href: '/suppliers', label: 'Suppliers', icon: Truck },
    { href: '/suppliers-owing', label: 'Suppliers Owing', icon: HandCoins },
    { href: '/assets', label: 'Assets', icon: Archive },
];

const businessNavItems = [
    { href: '/my-services', label: 'My Services', icon: Briefcase },
];

const secondaryNavItems = [
  { href: '/documents', label: 'Documents', icon: Folder },
  { href: '/messaging', label: 'Messaging', icon: MessageSquare },
];

const adminNavItems = [
  { href: '/employees', label: 'Employees', icon: UserCog },
  { href: '/hr', label: 'HR', icon: Users },
  { href: '/packages', label: 'Packages', icon: Package },
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
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  }

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <Button variant="ghost" className="w-full justify-start gap-2 px-2 text-lg h-12" asChild>
          <Link href="/dashboard">
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
         <SidebarGroup>
           <SidebarGroupLabel>Logistics</SidebarGroupLabel>
           <SidebarMenu>
             {logisticsNavItems.map((item) => (
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
         <SidebarGroup>
           <SidebarGroupLabel>Business</SidebarGroupLabel>
           <SidebarMenu>
             {businessNavItems.map((item) => (
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
