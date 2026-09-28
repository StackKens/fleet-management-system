import { Link } from 'wouter';
import {
  Truck,
  Activity,
  FileText,
  Fuel,
  AlertTriangle,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useTrips, useNotifications } from '@/hooks/use-fleet-data';

const statusVariant: Record<string, 'warning' | 'success' | 'danger' | 'info' | 'default'> = {
  Pending: 'warning',
  Approved: 'success',
  Declined: 'danger',
  'On route': 'info',
  Scheduled: 'default',
  Returned: 'success',
};

export default function DriverDashboard() {
  const { user } = useAuth();
  const { data: trips } = useTrips();
  const { data: notifications } = useNotifications();

  // In a real app, these would be scoped to the logged-in driver
  const myTrips = trips?.slice(0, 3) ?? [];
  const myNotifications = notifications?.slice(0, 4) ?? [];
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      {/* Header */}
      <section className="mb-7 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Driver Workspace</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
            Hello, {user?.name?.split(' ')[0] ?? 'Driver'}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Here is your assigned work and vehicle status for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/report-issue" data-testid="link-report-issue">
            <Button variant="outline" size="sm">
              <AlertTriangle className="h-3.5 w-3.5" />
              Report Issue
            </Button>
          </Link>
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
      <section aria-label="Driver summary" className="mb-8 grid grid-cols-2 divide-x divide-border border border-border bg-card sm:grid-cols-4">
        <div className="border-b border-border px-4 py-4 sm:border-b-0 sm:px-5">
          <p className="text-xs font-medium text-muted-foreground">Assigned Vehicle</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="data-mono text-[27px] font-semibold leading-none text-foreground">1</span>
            <span className="pb-0.5 text-[10px] text-muted-foreground">vehicle</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Currently assigned to you</p>
        </div>
        <div className="border-b border-border px-4 py-4 sm:border-b-0 sm:px-5">
          <p className="text-xs font-medium text-muted-foreground">Active Trips</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="data-mono text-[27px] font-semibold leading-none text-sky-700">
              {myTrips.filter((t) => t.status === 'On route' || t.status === 'Scheduled').length}
            </span>
            <span className="pb-0.5 text-[10px] text-muted-foreground">trips</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Scheduled or in progress</p>
        </div>
        <div className="px-4 py-4 sm:px-5">
          <p className="text-xs font-medium text-muted-foreground">Completed Trips</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="data-mono text-[27px] font-semibold leading-none text-emerald-700">
              {myTrips.filter((t) => t.status === 'Returned').length}
            </span>
            <span className="pb-0.5 text-[10px] text-muted-foreground">trips</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Successfully completed</p>
        </div>
        <div className="px-4 py-4 sm:px-5">
          <p className="text-xs font-medium text-muted-foreground">Pending Actions</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="data-mono text-[27px] font-semibold leading-none text-amber-700">
              {myNotifications.filter((n) => !n.read).length}
            </span>
            <span className="pb-0.5 text-[10px] text-muted-foreground">items</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Require your attention</p>
        </div>
      </section>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        {/* My Trips */}
        <section className="min-w-0 border border-border bg-card" aria-labelledby="my-trips-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="my-trips-heading" className="text-sm font-semibold text-foreground">My Trips</h3>
              <p className="mt-1 text-xs text-muted-foreground">Your current and upcoming assignments</p>
            </div>
            <Link href="/my-trips" data-testid="link-view-all-trips" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {myTrips.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No trips assigned to you at this time.
              </div>
            ) : (
              myTrips.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
                      <Activity className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{trip.destination}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {trip.departure} → {trip.expectedReturn}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusVariant[trip.status] ?? 'default'} dot>
                    {trip.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Notifications */}
        <section className="border border-border bg-card" aria-labelledby="driver-notifications-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="driver-notifications-heading" className="text-sm font-semibold text-foreground">Notifications</h3>
              <p className="mt-1 text-xs text-muted-foreground">Updates about your assignments</p>
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

      {/* Quick Actions */}
      <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        {/* Vehicle Status */}
        <section className="min-w-0 border border-border bg-card" aria-labelledby="vehicle-status-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="vehicle-status-heading" className="text-sm font-semibold text-foreground">My Vehicle</h3>
              <p className="mt-1 text-xs text-muted-foreground">Your assigned vehicle status</p>
            </div>
            <Link href="/my-vehicle" data-testid="link-view-vehicle" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex items-center gap-4 px-5 py-5">
            <div className="flex h-14 w-14 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
              <Truck className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Vehicle Assignment</p>
              <p className="mt-1 text-xs text-muted-foreground">
                View your assigned vehicle details, mileage, and inspection status.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="border border-border bg-card" aria-labelledby="quick-actions-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="quick-actions-heading" className="text-sm font-semibold text-foreground">Quick Actions</h3>
              <p className="mt-1 text-xs text-muted-foreground">Common tasks</p>
            </div>
          </div>
          <div className="space-y-2 px-5 py-4">
            <Link href="/inspections" className="flex items-center gap-3 rounded-md border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Submit Inspection
            </Link>
            <Link href="/my-fuel" className="flex items-center gap-3 rounded-md border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              Submit Fuel Record
            </Link>
            <Link href="/report-issue" className="flex items-center gap-3 rounded-md border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              Report an Issue
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
