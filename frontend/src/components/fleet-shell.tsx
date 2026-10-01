// =============================================================================
// FLEET SHELL — Main Layout Component
// =============================================================================
//
// WHAT IS THIS FILE?
// ------------------
// This file defines the MAIN LAYOUT of the application. It's the "frame" that
// wraps every page. Think of it like the frame of a house — the walls, roof,
// and door are always there, but the furniture (pages) changes.
//
// WHAT DOES IT CONTAIN?
// --------------------
// 1. SIDEBAR: Navigation menu (role-based)
// 2. HEADER: Top bar with breadcrumb, notifications, and logout
// 3. MAIN CONTENT: Where pages are rendered
// 4. MOBILE DRAWER: Slide-out navigation for mobile devices
//
// WHY A SEPARATE SHELL COMPONENT?
// -------------------------------
// Without this, every page would need to include the sidebar and header:
//   // In Vehicles.tsx
//   <Sidebar />
//   <Header />
//   <VehicleList />
//
//   // In Drivers.tsx
//   <Sidebar />
//   <Header />
//   <DriverList />
//
// With the shell:
//   // In App.tsx
//   <FleetShell>
//     <Vehicles />  // Just the page content
//   </FleetShell>
//
// This is DRY (Don't Repeat Yourself) — write once, use everywhere.
//
// =============================================================================

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
import { useLiveClock } from '@/hooks/use-live-clock';
import { useAuth } from '@/contexts/auth-context';
import { Avatar } from '@/components/ui/avatar';
import { getNavigationForRole, type NavSection } from '@/data/navigation';

// =============================================================================
// NAVIGATION GROUP COMPONENT
// =============================================================================
// Renders a section of navigation items (e.g., "Workspace", "Operations")
//
// WHY A SEPARATE COMPONENT?
// ------------------------
// The sidebar has multiple sections, each with multiple items.
// By extracting NavigationGroup, we avoid repeating the same markup.
//
// PROPS:
// - title: Section name (e.g., "Workspace")
// - items: Array of navigation items
// - location: Current URL path
// - onNavigate: Callback when a nav item is clicked (closes mobile drawer)
// =============================================================================

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
      {/* Section title (e.g., "Workspace") */}
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/45">
        {title}
      </p>
      <nav aria-label={`${title} navigation`} className="space-y-0.5">
        {items.map(({ label, href, icon: Icon }) => {
          // Highlight the active nav item
          // WHY? So users know which page they're on
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

// =============================================================================
// SIDEBAR COMPONENT
// =============================================================================
// The sidebar shows navigation items based on the user's role.
//
// WHY ROLE-BASED NAVIGATION?
// -------------------------
// Different roles need different tools:
//   - Driver: "My Vehicle", "My Trips", "Report Issue"
//   - Staff: "Request Vehicle", "My Requests"
//   - Fleet Manager: "Vehicles", "Drivers", "Requests", "Reports"
//   - Admin: "Users", "Roles", "Departments"
//
// Showing irrelevant items confuses users and clutters the UI.
//
// HOW IT WORKS:
// 1. Get the current user from useAuth()
// 2. Get the navigation config for their role
// 3. Render each section and its items
// =============================================================================

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const [location] = useLocation();
  const { user } = useAuth();

  // If no user is logged in, don't show the sidebar
  if (!user) return null;

  // Get navigation items for this user's role
  // WHY? Each role sees different menu items
  const sections = getNavigationForRole(user.role);

  return (
    <aside className="ops-sidebar flex h-full min-h-dvh w-[252px] flex-col border-r border-sidebar-border" aria-label="Fleet Operations navigation">
      {/* Logo / Brand */}
      <div className="flex h-[76px] items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground" aria-hidden="true">
          <ShieldCheck className="h-5 w-5" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-sidebar-accent-foreground">Fleet Operations</p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-sidebar-foreground/50">Operations desk</p>
        </div>
      </div>

      {/* Navigation Sections */}
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

      {/* User Info (bottom of sidebar) */}
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

// =============================================================================
// FLEET SHELL COMPONENT
// =============================================================================
// This is the main layout wrapper. It provides:
// 1. Fixed sidebar (desktop) / drawer (mobile)
// 2. Sticky header with breadcrumb, notifications, logout
// 3. Main content area where pages render
//
// WHY FIXED SIDEBAR?
// -----------------
// A fixed sidebar means users can always see the navigation, no matter how
// far they scroll down the page. This is standard in dashboard applications.
//
// WHY STICKY HEADER?
// -----------------
// A sticky header means the top bar (with notifications and logout) is always
// visible. Users don't have to scroll up to access these features.
//
// RESPONSIVE BEHAVIOR:
// -------------------
// - Desktop (md+): Sidebar is always visible, fixed on the left
// - Mobile (< md): Sidebar is hidden, hamburger menu opens a drawer
// =============================================================================

export function FleetShell({ children }: { children: ReactNode }) {
  // ─── STATE ────────────────────────────────────────────────────────────────
  // mobileOpen: Is the mobile navigation drawer open?
  // notificationsOpen: Is the notifications dropdown open?
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // ─── DATA ─────────────────────────────────────────────────────────────────
  const [location] = useLocation();
  const { data: notifications } = useNotifications();
  const { user, logout } = useAuth();
  // Live clock — the header used to be frozen at "Thursday, 18 July 2024 · 09:14".
  const now = useLiveClock();

  // Don't render anything if no user is logged in
  if (!user) return null;

  // ─── DERIVED DATA ─────────────────────────────────────────────────────────
  // Get navigation for this user's role
  const sections = getNavigationForRole(user.role);
  // Flatten all nav items to find the current page
  const allItems = sections.flatMap((s) => s.items);
  // Find the current nav item (for breadcrumb)
  const currentItem = allItems.find((item) => item.href === location);
  // Count unread notifications (for the badge)
  const unreadCount = (notifications ?? []).filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="ops-shell flex">
      {/* DESKTOP SIDEBAR (fixed, always visible) */}
      {/* WHY fixed inset-y-0 left-0? */}
      {/* - fixed: Stays in place when scrolling */}
      {/* - inset-y-0: Stretches from top to bottom */}
      {/* - left-0: Anchored to the left edge */}
      <div className="fixed inset-y-0 left-0 z-40 hidden md:block">
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      {/* MOBILE DRAWER (slide-out overlay) */}
      {/* WHY z-50? */}
      {/* - Higher than the sidebar (z-40) so it appears on top */}
      {/* - The backdrop (bg-foreground/35) dims the content behind */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop: Click to close */}
          <div className="absolute inset-0 bg-foreground/35" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          {/* Drawer content */}
          <div className="relative">
            {/* Close button */}
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

      {/* MAIN CONTENT AREA */}
      {/* WHY md:ml-[252px]? */}
      {/* - Matches the sidebar width (252px) */}
      {/* - Prevents content from hiding behind the fixed sidebar */}
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col md:ml-[252px]">
        {/* HEADER (sticky top bar) */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-border bg-card px-5 sm:px-8">
          {/* Left: Hamburger (mobile) + Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Hamburger button (mobile only) */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              data-testid="button-open-navigation"
              className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Breadcrumb: "Fleet Operations / Vehicles" */}
            <div>
              <p className="text-xs font-medium text-muted-foreground">Fleet Operations / <span className="text-foreground">{currentItem?.label ?? 'Dashboard'}</span></p>
              <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">{currentItem?.label ?? 'Dashboard'}</h1>
            </div>
          </div>

          {/* Right: Date, Notifications, Logout */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Current date & time — live, from the browser clock */}
            <time
              className="hidden text-right sm:block"
              dateTime={now.iso}
              data-testid="shell-current-datetime"
            >
              <span className="block text-xs font-medium text-foreground">{now.longDate}</span>
              <span className="mt-0.5 block text-[11px] text-muted-foreground">
                {now.timeZone ? `${now.timeZone} · ` : ''}{now.time}
              </span>
            </time>
            <div className="h-7 w-px bg-border" aria-hidden="true" />

            {/* Notification bell with unread badge */}
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label="View notifications"
              data-testid="button-notifications"
              aria-expanded={notificationsOpen}
              className="relative flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
              {/* Unread count badge */}
              {unreadCount > 0 && (
                <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" aria-label={`${unreadCount} unread notifications`} />
              )}
            </button>

            {/* Notifications dropdown */}
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

            {/* Logout button */}
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

        {/* PAGE CONTENT */}
        {/* This is where the active page renders */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

// =============================================================================
// KEY CONCEPTS SUMMARY
// =============================================================================
//
// 1. Layout Component: Wraps every page with consistent structure
// 2. Fixed Sidebar: Always visible on desktop, always accessible
// 3. Sticky Header: Top bar stays visible when scrolling
// 4. Mobile Drawer: Slide-out navigation for small screens
// 5. Role-Based Navigation: Different roles see different menu items
// 6. Breadcrumb: Shows current page location
// 7. Notification Badge: Shows unread count
// 8. Responsive Design: Adapts to all screen sizes
//
// WHY THIS PATTERN?
// ----------------
// - Consistency: Every page has the same layout
// - Usability: Navigation is always accessible
// - Maintainability: Change the layout once, affects all pages
// - Professional: Looks like a real dashboard application
//
// =============================================================================
