import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BarChart3,
  Bell,
  CarFront,
  ClipboardList,
  Fuel,
  Gauge,
  Menu,
  Settings,
  ShieldCheck,
  Truck,
  UserRound,
  UsersRound,
  Wrench,
  X,
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  section?: string;
};

const primaryNavigation: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Gauge },
  { label: 'Vehicles', href: '/vehicles', icon: Truck },
  { label: 'Requests', href: '/requests', icon: ClipboardList },
  { label: 'Assignments', href: '/assignments', icon: CarFront },
  { label: 'Drivers', href: '/drivers', icon: UsersRound },
  { label: 'Trips', href: '/trips', icon: Activity },
];

const operationsNavigation: NavItem[] = [
  { label: 'Maintenance', href: '/maintenance', icon: Wrench },
  { label: 'Fuel', href: '/fuel', icon: Fuel },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
];

const administrationNavigation: NavItem[] = [
  { label: 'Users', href: '/users', icon: UserRound },
  { label: 'Settings', href: '/settings', icon: Settings },
];

function NavigationGroup({
  title,
  items,
  location,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  location: string;
  onNavigate: () => void;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/45">
        {title}
      </p>
      <nav aria-label={`${title} navigation`} className="space-y-0.5">
        {items.map(({ label, href, icon: Icon }) => {
          const isActive = location === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              data-testid={`link-nav-${label.toLowerCase()}`}
              className={`group flex min-h-10 items-center gap-3 border-l-2 px-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'border-transparent text-sidebar-foreground/70 hover:border-sidebar-foreground/30 hover:bg-sidebar-accent/65 hover:text-sidebar-accent-foreground'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`h-[17px] w-[17px] ${isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/55'}`} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const [location] = useLocation();
  return (
    <aside className="ops-sidebar flex h-full min-h-dvh w-[252px] flex-col border-r border-sidebar-border" aria-label="Fleet Operations navigation">
      <div className="flex h-[76px] items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground" aria-hidden="true">
          <ShieldCheck className="h-5 w-5" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-sidebar-accent-foreground">Fleet Operations</p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-sidebar-foreground/50">Operations desk</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-7">
        <NavigationGroup title="Workspace" items={primaryNavigation} location={location} onNavigate={onNavigate} />
        <NavigationGroup title="Operations" items={operationsNavigation} location={location} onNavigate={onNavigate} />
        <NavigationGroup title="Administration" items={administrationNavigation} location={location} onNavigate={onNavigate} />
      </div>

      <div className="border-t border-sidebar-border px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">FM</div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-sidebar-accent-foreground">Fleet Manager</p>
            <p className="truncate text-[11px] text-sidebar-foreground/50">Kampala operations</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function FleetShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [location] = useLocation();
  const currentItem = [...primaryNavigation, ...operationsNavigation, ...administrationNavigation].find((item) => item.href === location);

  return (
    <div className="ops-shell flex">
      <div className="hidden md:block">
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-foreground/35" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="relative">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              data-testid="button-close-navigation"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-border bg-card px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              data-testid="button-open-navigation"
              className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Fleet Operations / <span className="text-foreground">{currentItem?.label ?? 'Dashboard'}</span></p>
              <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">{currentItem?.label ?? 'Dashboard'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-foreground">Thursday, 18 July 2024</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">East Africa Time · 09:14</p>
            </div>
            <div className="h-7 w-px bg-border" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label="View notifications"
              data-testid="button-notifications"
              aria-expanded={notificationsOpen}
              className="relative flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" aria-label="2 unread notifications" />
            </button>
            {notificationsOpen ? (
              <div className="absolute right-5 top-[62px] w-[290px] border border-border bg-card shadow-md sm:right-8" role="status" data-testid="panel-notifications">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-xs font-semibold text-foreground">Notifications</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">2 items need review</p>
                </div>
                <div className="divide-y divide-border">
                  <Link href="/maintenance" onClick={() => setNotificationsOpen(false)} data-testid="link-notification-maintenance" className="block px-4 py-3 text-xs hover:bg-muted/50">
                    <p className="font-semibold text-foreground">UAT 706P service due</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Maintenance attention item</p>
                  </Link>
                  <Link href="/requests" onClick={() => setNotificationsOpen(false)} data-testid="link-notification-requests" className="block px-4 py-3 text-xs hover:bg-muted/50">
                    <p className="font-semibold text-foreground">2 requests need review</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Pending operations queue</p>
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}