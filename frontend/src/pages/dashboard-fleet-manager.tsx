import { useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  RefreshCw,
  TriangleAlert,
  UserRound,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useActivity, useAttentionItems, useRequests, useTrips, useVehicleSummary } from '@/hooks/use-fleet-data';
import type { ActivityType, AttentionSeverity } from '@/data/types';

const summaryItems = [
  { key: 'total', label: 'Total fleet', value: 0, note: 'registered vehicles', tone: 'default' as const },
  { key: 'available', label: 'Available', value: 0, note: 'ready for assignment', tone: 'positive' as const },
  { key: 'assigned', label: 'Assigned', value: 0, note: 'currently allocated', tone: 'info' as const },
  { key: 'inService', label: 'In service', value: 0, note: 'at workshop', tone: 'warning' as const },
  { key: 'maintenance', label: 'Maintenance', value: 0, note: 'awaiting attention', tone: 'negative' as const },
];

const statusVariant: Record<string, 'warning' | 'success' | 'danger' | 'info' | 'default'> = {
  Pending: 'warning',
  Approved: 'success',
  Declined: 'danger',
  'On route': 'info',
  Scheduled: 'default',
  Returned: 'success',
};

const severityTone: Record<AttentionSeverity, string> = {
  high: 'bg-red-600',
  medium: 'bg-amber-500',
  low: 'bg-slate-400',
};

function ActivityIcon({ type }: { type: ActivityType }) {
  if (type === 'assignment') return <UserRound className="h-4 w-4" strokeWidth={1.8} />;
  if (type === 'maintenance') return <Wrench className="h-4 w-4" strokeWidth={1.8} />;
  if (type === 'request') return <CalendarDays className="h-4 w-4" strokeWidth={1.8} />;
  return <CheckCircle2 className="h-4 w-4" strokeWidth={1.8} />;
}

export default function FleetManagerDashboard() {
  const [refreshed, setRefreshed] = useState('09:14');
  const { data: summary } = useVehicleSummary();
  const { data: requests } = useRequests();
  const { data: attentionItems } = useAttentionItems();
  const { data: trips } = useTrips();
  const { data: activity } = useActivity();

  const handleRefresh = () => {
    setRefreshed(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()));
  };

  const items = summary
    ? summaryItems.map((item) => ({ ...item, value: summary[item.key as keyof typeof summary] }))
    : summaryItems;

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <section className="mb-7 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Operations overview</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">Good morning, Fleet Manager</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Here is the current position of the fleet and the items requiring attention today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-[11px] text-muted-foreground sm:inline">Updated {refreshed}</span>
          <Button variant="outline" size="sm" onClick={handleRefresh} data-testid="button-refresh-dashboard">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Link href="/requests" data-testid="link-new-request">
            <Button size="sm">
              Review requests
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </section>

      <section aria-label="Fleet summary" className="mb-8 grid grid-cols-2 divide-x divide-border border border-border bg-card sm:grid-cols-5">
        {items.map((item) => (
          <div key={item.key} data-testid={`summary-${item.key}`} className="border-b border-border px-4 py-4 last:border-b-0 sm:border-b-0 sm:px-5">
            <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            <div className="mt-2 flex items-end gap-2">
              <span className={`data-mono text-[27px] font-semibold leading-none ${
                item.tone === 'positive' ? 'text-emerald-700' :
                item.tone === 'warning' ? 'text-amber-700' :
                item.tone === 'negative' ? 'text-red-700' :
                item.tone === 'info' ? 'text-sky-700' :
                'text-foreground'
              }`}>{item.value}</span>
              <span className="pb-0.5 text-[10px] text-muted-foreground">vehicles</span>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <section className="min-w-0 border border-border bg-card" aria-labelledby="requests-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="requests-heading" className="text-sm font-semibold text-foreground">Active vehicle requests</h3>
              <p className="mt-1 text-xs text-muted-foreground">Requests in the current operating queue</p>
            </div>
            <Link href="/requests" data-testid="link-view-all-requests" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(requests ?? []).slice(0, 4).map((request) => (
                <TableRow key={request.id} data-testid={`row-request-${request.id}`}>
                  <TableCell>
                    <p className="font-semibold text-foreground">{request.requester}</p>
                    <p className="mt-1 data-mono text-[10px] text-muted-foreground">{request.id}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{request.department}</TableCell>
                  <TableCell className="font-medium text-foreground">{request.destination}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{request.requestedDate}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[request.status] ?? 'default'} dot>
                      {request.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section className="border border-border bg-card" aria-labelledby="attention-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="attention-heading" className="text-sm font-semibold text-foreground">Needs attention</h3>
              <p className="mt-1 text-xs text-muted-foreground">Items affecting fleet readiness</p>
            </div>
            <TriangleAlert className="h-4 w-4 text-amber-600" strokeWidth={1.8} />
          </div>
          <div className="divide-y divide-border">
            {(attentionItems ?? []).map((item) => (
              <div key={item.id} data-testid={`attention-${item.id}`} className="flex gap-3 px-5 py-4">
                <span className={`mt-1.5 h-2 w-2 flex-none rounded-full ${severityTone[item.severity]}`} aria-label={`${item.severity} priority`} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-xs font-semibold text-foreground">{item.title}</p>
                    <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{item.category}</span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border bg-muted/30 px-5 py-3">
            <Link href="/maintenance" data-testid="link-review-attention" className="text-xs font-semibold text-primary hover:underline">Review operational items</Link>
          </div>
        </section>
      </div>

      <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <section className="min-w-0 border border-border bg-card" aria-labelledby="trips-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="trips-heading" className="text-sm font-semibold text-foreground">Today&apos;s trips</h3>
              <p className="mt-1 text-xs text-muted-foreground">Current and upcoming vehicle movements</p>
            </div>
            <Link href="/trips" data-testid="link-view-trip-schedule" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Schedule <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle / driver</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Expected return</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(trips ?? []).slice(0, 3).map((trip) => (
                <TableRow key={trip.id} data-testid={`row-trip-${trip.id}`}>
                  <TableCell>
                    <p className="data-mono font-semibold text-foreground">{trip.vehicle}</p>
                    <p className="mt-1 text-muted-foreground">{trip.driver}</p>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{trip.destination}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{trip.departure}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{trip.expectedReturn}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[trip.status] ?? 'default'} dot>
                      {trip.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section className="border border-border bg-card" aria-labelledby="activity-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="activity-heading" className="text-sm font-semibold text-foreground">Recent activity</h3>
              <p className="mt-1 text-xs text-muted-foreground">Latest changes in the workspace</p>
            </div>
            <Clock3 className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
          </div>
          <div className="divide-y divide-border">
            {(activity ?? []).slice(0, 4).map((event) => (
              <div key={event.id} data-testid={`activity-${event.id}`} className="flex gap-3 px-5 py-4">
                <div className="flex h-7 w-7 flex-none items-center justify-center border border-border bg-muted/40 text-muted-foreground">
                  <ActivityIcon type={event.type} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs leading-5 text-foreground">{event.message}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{event.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
