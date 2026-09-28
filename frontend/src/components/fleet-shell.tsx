import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Bell,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useNotifications } from '@/hooks/use-fleet-data';
import { useAuth } from '@/contexts/auth-context';
import { Avatar } from '@/components/ui/avatar';
import { getNavigationForRole, type NavSection } from '@/data/navigation';

function NavigationGroup({
  title,
  items,
  location,
  onNavigate,
}: {
  title: string;
  items: NavSection['items'];
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
  const { user } = useAuth();

  if (!user) return null;

  const sections = getNavigationForRole(user.role);

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
        {sections.map((section) => (
          <NavigationGroup
            key={section.title}
            title={section.title}
            items={section.items}
            location={location}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <div className="border-t border-sidebar-border px-6 py-5">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-sidebar-accent-foreground">{user.name}</p>
            <p className="truncate text-[11px] text-sidebar-foreground/50">{user.role}</p>
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
  const { data: notifications } = useNotifications();
  const { user, logout } = useAuth();

  if (!user) return null;

  const sections = getNavigationForRole(user.role);
  const allItems = sections.flatMap((s) => s.items);
  const currentItem = allItems.find((item) => item.href === location);
  const unreadCount = (notifications ?? []).filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="ops-shell flex">
      <div className="fixed inset-y-0 left-0 z-40 hidden md:block">
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

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col md:ml-[252px]">
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
              {unreadCount > 0 && (
                <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" aria-label={`${unreadCount} unread notifications`} />
              )}
            </button>
            {notificationsOpen ? (
              <div className="absolute right-5 top-[62px] w-[290px] border border-border bg-card shadow-md sm:right-8" role="status" data-testid="panel-notifications">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-xs font-semibold text-foreground">Notifications</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{unreadCount} item{unreadCount !== 1 ? 's' : ''} need review</p>
                </div>
                <div className="max-h-[300px] divide-y divide-border overflow-y-auto">
                  {(notifications ?? []).map((notification) => (
                    <Link
                      key={notification.id}
                      href={notification.link}
                      onClick={() => setNotificationsOpen(false)}
                      data-testid={`link-notification-${notification.id}`}
                      className="block px-4 py-3 text-xs hover:bg-muted/50"
                    >
                      <p className={`font-semibold ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {notification.title}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{notification.message}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{notification.timestamp}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="h-7 w-px bg-border" aria-hidden="true" />
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Sign out"
              data-testid="button-logout"
              className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </button>
          </div>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
