import { Link } from 'wouter';
import {
  UserRound,
  UserCog,
  Building2,
  ScrollText,
  Settings,
  Bell,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useUsers, useDepartments, useNotifications } from '@/hooks/use-fleet-data';
import { useLiveClock } from '@/hooks/use-live-clock';

export default function AdminDashboard() {
  const { user } = useAuth();
  const now = useLiveClock();
  const { data: users } = useUsers();
  const { data: departments } = useDepartments();
  const { data: notifications } = useNotifications();

  const myNotifications = notifications?.slice(0, 4) ?? [];
  const unreadCount = myNotifications.filter((n) => !n.read).length;
  const activeUsers = users?.filter((u) => u.status === 'Active').length ?? 0;
  const totalUsers = users?.length ?? 0;

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      {/* Header */}
      <section className="mb-7 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Admin Workspace</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
            {now.greeting}, {user?.name?.split(' ')[0]}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage users, roles, departments, and system configuration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <time
            className="hidden text-[11px] text-muted-foreground sm:inline"
            dateTime={now.iso}
            data-testid="dashboard-current-datetime"
          >
            {now.dateTime}
          </time>
          <Link href="/notifications" data-testid="link-notifications">
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-3.5 w-3.5" />
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section aria-label="Admin summary" className="mb-8 grid grid-cols-2 divide-x divide-border border border-border bg-card sm:grid-cols-4">
        <div className="border-b border-border px-4 py-4 sm:border-b-0 sm:px-5">
          <p className="text-xs font-medium text-muted-foreground">Total Users</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="data-mono text-[27px] font-semibold leading-none text-foreground">{totalUsers}</span>
            <span className="pb-0.5 text-[10px] text-muted-foreground">users</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Registered in system</p>
        </div>
        <div className="border-b border-border px-4 py-4 sm:border-b-0 sm:px-5">
          <p className="text-xs font-medium text-muted-foreground">Active Users</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="data-mono text-[27px] font-semibold leading-none text-emerald-700">{activeUsers}</span>
            <span className="pb-0.5 text-[10px] text-muted-foreground">users</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Currently active</p>
        </div>
        <div className="px-4 py-4 sm:px-5">
          <p className="text-xs font-medium text-muted-foreground">Departments</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="data-mono text-[27px] font-semibold leading-none text-sky-700">
              {departments?.length ?? 0}
            </span>
            <span className="pb-0.5 text-[10px] text-muted-foreground">departments</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Organizational units</p>
        </div>
        <div className="px-4 py-4 sm:px-5">
          <p className="text-xs font-medium text-muted-foreground">System Status</p>
          <div className="mt-2 flex items-end gap-2">
            <Badge variant="success" dot>Operational</Badge>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">All systems running</p>
        </div>
      </section>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        {/* Quick Actions */}
        <section className="min-w-0 border border-border bg-card" aria-labelledby="admin-actions-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="admin-actions-heading" className="text-sm font-semibold text-foreground">Platform Management</h3>
              <p className="mt-1 text-xs text-muted-foreground">Manage users, roles, and configuration</p>
            </div>
          </div>
          <div className="grid gap-3 px-5 py-5 sm:grid-cols-2">
            <Link href="/users" className="flex items-center gap-3 rounded-md border border-border px-4 py-4 hover:bg-muted/50">
              <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
                <UserRound className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Users</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Manage user accounts</p>
              </div>
            </Link>
            <Link href="/roles" className="flex items-center gap-3 rounded-md border border-border px-4 py-4 hover:bg-muted/50">
              <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
                <UserCog className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Roles</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Manage roles and permissions</p>
              </div>
            </Link>
            <Link href="/departments" className="flex items-center gap-3 rounded-md border border-border px-4 py-4 hover:bg-muted/50">
              <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
                <Building2 className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Departments</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Manage organizational units</p>
              </div>
            </Link>
            <Link href="/audit-logs" className="flex items-center gap-3 rounded-md border border-border px-4 py-4 hover:bg-muted/50">
              <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
                <ScrollText className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Audit Logs</p>
                <p className="mt-0.5 text-xs text-muted-foreground">View system activity</p>
              </div>
            </Link>
            <Link href="/settings" className="flex items-center gap-3 rounded-md border border-border px-4 py-4 hover:bg-muted/50">
              <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
                <Settings className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Settings</p>
                <p className="mt-0.5 text-xs text-muted-foreground">System configuration</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Notifications */}
        <section className="border border-border bg-card" aria-labelledby="admin-notifications-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="admin-notifications-heading" className="text-sm font-semibold text-foreground">Notifications</h3>
              <p className="mt-1 text-xs text-muted-foreground">System alerts and updates</p>
            </div>
            <Bell className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
          </div>
          <div className="divide-y divide-border">
            {myNotifications.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No notifications at this time.
              </div>
            ) : (
              myNotifications.map((notification) => (
                <div key={notification.id} className="px-5 py-4">
                  <div className="flex items-start gap-2">
                    {!notification.read && (
                      <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-primary" aria-label="Unread" />
                    )}
                    <div className="min-w-0">
                      <p className={`text-xs ${notification.read ? 'text-muted-foreground' : 'font-semibold text-foreground'}`}>
                        {notification.title}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{notification.message}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{notification.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Recent Activity */}
      <div className="mt-7">
        <section className="min-w-0 border border-border bg-card" aria-labelledby="admin-activity-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="admin-activity-heading" className="text-sm font-semibold text-foreground">System Overview</h3>
              <p className="mt-1 text-xs text-muted-foreground">Platform health and recent activity</p>
            </div>
            <Link href="/audit-logs" data-testid="link-view-audit" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              View audit logs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex items-center gap-4 px-5 py-5">
            <div className="flex h-14 w-14 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
              <ShieldCheck className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">System Status: Operational</p>
              <p className="mt-1 text-xs text-muted-foreground">
                All systems are running normally. No critical issues detected.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
