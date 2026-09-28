import { Link } from 'wouter';
import {
  ClipboardList,
  Activity,
  Bell,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useRequests, useTrips, useNotifications } from '@/hooks/use-fleet-data';

const statusVariant: Record<string, 'warning' | 'success' | 'danger' | 'info' | 'default'> = {
  Pending: 'warning',
  Approved: 'success',
  Declined: 'danger',
  'On route': 'info',
  Scheduled: 'default',
  Returned: 'success',
};

export default function StaffDashboard() {
  const { user } = useAuth();
  const { data: requests } = useRequests();
  const { data: trips } = useTrips();
  const { data: notifications } = useNotifications();

  // In a real app, these would be scoped to the logged-in staff member
  const myRequests = requests?.slice(0, 4) ?? [];
  const myTrips = trips?.slice(0, 3) ?? [];
  const myNotifications = notifications?.slice(0, 4) ?? [];
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  const pendingCount = myRequests.filter((r) => r.status === 'Pending').length;
  const approvedCount = myRequests.filter((r) => r.status === 'Approved').length;

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      {/* Header */}
      <section className="mb-7 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Staff Workspace</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
            Hello, {user?.name?.split(' ')[0]}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Request and track transportation for your department.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
          <Link href="/request-vehicle" data-testid="link-request-vehicle">
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              Request Vehicle
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section aria-label="Staff summary" className="mb-8 grid grid-cols-2 divide-x divide-border border border-border bg-card sm:grid-cols-4">
        <div className="border-b border-border px-4 py-4 sm:border-b-0 sm:px-5">
          <p className="text-xs font-medium text-muted-foreground">Pending Requests</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="data-mono text-[27px] font-semibold leading-none text-amber-700">{pendingCount}</span>
            <span className="pb-0.5 text-[10px] text-muted-foreground">requests</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Awaiting approval</p>
        </div>
        <div className="border-b border-border px-4 py-4 sm:border-b-0 sm:px-5">
          <p className="text-xs font-medium text-muted-foreground">Approved Requests</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="data-mono text-[27px] font-semibold leading-none text-emerald-700">{approvedCount}</span>
            <span className="pb-0.5 text-[10px] text-muted-foreground">requests</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Ready for travel</p>
        </div>
        <div className="px-4 py-4 sm:px-5">
          <p className="text-xs font-medium text-muted-foreground">Upcoming Trips</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="data-mono text-[27px] font-semibold leading-none text-sky-700">
              {myTrips.filter((t) => t.status === 'Scheduled' || t.status === 'On route').length}
            </span>
            <span className="pb-0.5 text-[10px] text-muted-foreground">trips</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Scheduled travel</p>
        </div>
        <div className="px-4 py-4 sm:px-5">
          <p className="text-xs font-medium text-muted-foreground">Completed Trips</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="data-mono text-[27px] font-semibold leading-none text-foreground">
              {myTrips.filter((t) => t.status === 'Returned').length}
            </span>
            <span className="pb-0.5 text-[10px] text-muted-foreground">trips</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Successfully completed</p>
        </div>
      </section>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        {/* My Requests */}
        <section className="min-w-0 border border-border bg-card" aria-labelledby="my-requests-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="my-requests-heading" className="text-sm font-semibold text-foreground">My Requests</h3>
              <p className="mt-1 text-xs text-muted-foreground">Your vehicle requests and their status</p>
            </div>
            <Link href="/my-requests" data-testid="link-view-all-requests" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {myRequests.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No requests yet. Request a vehicle to get started.
              </div>
            ) : (
              myRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
                      <ClipboardList className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{request.destination}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {request.startDate} → {request.endDate}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusVariant[request.status] ?? 'default'} dot>
                    {request.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Notifications */}
        <section className="border border-border bg-card" aria-labelledby="staff-notifications-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="staff-notifications-heading" className="text-sm font-semibold text-foreground">Notifications</h3>
              <p className="mt-1 text-xs text-muted-foreground">Updates about your requests</p>
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

      {/* Upcoming Trips */}
      <div className="mt-7">
        <section className="min-w-0 border border-border bg-card" aria-labelledby="staff-trips-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="staff-trips-heading" className="text-sm font-semibold text-foreground">Upcoming Trips</h3>
              <p className="mt-1 text-xs text-muted-foreground">Your approved and scheduled travel</p>
            </div>
            <Link href="/my-trips" data-testid="link-view-trips" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {myTrips.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No upcoming trips. Request a vehicle to get started.
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
      </div>
    </div>
  );
}
