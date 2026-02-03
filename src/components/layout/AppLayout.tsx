import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  Sprout, 
  Menu, 
  X, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Wallet,
  Repeat,
  DollarSign,
  Map as MapIcon,
  ShoppingBag,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { OnlineStatus } from '@/components/common/OfflineIndicator';
import { VoiceAssistant } from '@/components/common/VoiceAssistant';
import { useTranslation } from 'react-i18next';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, path, active }: SidebarItemProps) => (
  <Link
    to={path}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
      active 
        ? "bg-accent text-accent-foreground shadow-lg" 
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-accent-foreground" : "group-hover:scale-110 transition-transform")} />
    <span className="font-medium">{label}</span>
    {active && <ChevronRight className="ml-auto w-4 h-4" />}
  </Link>
);

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, ready } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: ready ? t('dashboard') : 'Dashboard', path: '/' },
    { icon: MapIcon, label: 'Field Map', path: '/map' },
    { icon: TrendingUp, label: ready ? t('marketIntelligence') : 'Market Intelligence', path: '/market' },
    { icon: ShoppingBag, label: 'Shop', path: '/shop' },
    { icon: Repeat, label: ready ? t('seedToolSwap') : 'Seed & Tool Swap', path: '/swap' },
    { icon: DollarSign, label: ready ? t('financial') : 'Financial', path: '/financial' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: Store, label: ready ? t('marketplace') : 'Marketplace', path: '/marketplace' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar py-6 px-4">
      <div className="flex items-center justify-center gap-2 mb-10 px-4">
        <div className="bg-accent p-2 rounded-xl">
          <Sprout className="w-6 h-6 text-accent-foreground" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-sidebar-foreground">AgroPulse</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            active={location.pathname === item.path}
          />
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-sidebar-border space-y-2">
        <div className="px-4 py-2">
          <OnlineStatus />
        </div>
        <SidebarItem icon={Settings} label="Settings" path="/settings" active={location.pathname === '/settings'} />
        <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
      {/* Copyright Footer */}
      <div className="mt-4 pt-4 border-t border-sidebar-border">
        <p className="text-xs text-center text-sidebar-foreground/50">
          © AgroPulse Tech 2026
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col shrink-0 border-r border-border">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="fixed top-4 left-4 z-50 bg-background border-border shadow-md"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-none">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-background/80 backdrop-blur-md border-b border-border">
           <div className="flex items-center gap-2 md:hidden pl-12">
            <Sprout className="w-5 h-5 text-accent flex-shrink-0" />
            <span className="text-lg font-bold truncate">AgroPulse</span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <VoiceAssistant variant="header" />
            <LanguageSwitcher />
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
        
        {/* Footer Copyright */}
        <footer className="py-4 px-6 border-t border-border bg-background">
          <p className="text-xs text-center text-muted-foreground">
            © AgroPulse Tech 2026. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};
