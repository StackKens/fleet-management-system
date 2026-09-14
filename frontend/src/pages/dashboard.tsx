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
import {
  activity,
  attentionItems,
  requests,
  trips,
  vehicleSummary,
  type ActivityType,
  type AttentionSeverity,
  type RequestStatus,
  type TripStatus,
} from '@/data/mock-data';

const summaryItems = [
  { key: 'total', label: 'Total fleet', value: vehicleSummary.total, note: 'registered vehicles' },
  { key: 'available', label: 'Available', value: vehicleSummary.available, note: 'ready for assignment', tone: 'positive' },
  { key: 'assigned', label: 'Assigned', value: vehicleSummary.assigned, note: 'currently allocated' },
  { key: 'inService', label: 'In service', value: vehicleSummary.inService, note: 'at workshop', tone: 'warning' },
  { key: 'maintenance', label: 'Maintenance', value: vehicleSummary.maintenance, note: 'awaiting attention', tone: 'negative' },
];

function StatusPill({ status }: { status: RequestStatus | TripStatus }) {
  const classes: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Declined: 'bg-red-50 text-red-700 border-red-200',
    'On route': 'bg-sky-50 text-sky-700 border-sky-200',
    Scheduled: 'bg-slate-100 text-slate-600 border-slate-200',
    Returned: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[11px] font-semibold ${classes[status]}`}>
      <span className="status-dot bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

function SeverityMark({ severity }: { severity: AttentionSeverity }) {
  const tone: Record<AttentionSeverity, string> = {
    high: 'bg-red-600',
    medium: 'bg-amber-500',
    low: 'bg-slate-400',
  };
  return <span className={`mt-1.5 h-2 w-2 flex-none rounded-full ${tone[severity]}`} aria-label={`${severity} priority`} />;
}

function ActivityIcon({ type }: { type: ActivityType }) {
  if (type === 'assignment') return <UserRound className="h-4 w-4" strokeWidth={1.8} />;
  if (type === 'maintenance') return <Wrench className="h-4 w-4" strokeWidth={1.8} />;
  if (type === 'request') return <CalendarDays className="h-4 w-4" strokeWidth={1.8} />;
  return <CheckCircle2 className="h-4 w-4" strokeWidth={1.8} />;
}

export default function Dashboard() {
  const [refreshed, setRefreshed] = useState('09:14');
  const handleRefresh = () => {
    setRefreshed(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()));
  };

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
          <button
            type="button"
            onClick={handleRefresh}
            data-testid="button-refresh-dashboard"
            className="inline-flex h-9 items-center gap-2 border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <Link
            href="/requests"
            data-testid="link-new-request"
            className="inline-flex h-9 items-center gap-2 bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Review requests
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section aria-label="Fleet summary" className="mb-8 grid grid-cols-2 divide-x divide-border border border-border bg-card sm:grid-cols-5">
        {summaryItems.map((item) => (
          <div key={item.key} data-testid={`summary-${item.key}`} className="border-b border-border px-4 py-4 last:border-b-0 sm:border-b-0 sm:px-5">
            <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            <div className="mt-2 flex items-end gap-2">
              <span className={`data-mono text-[27px] font-semibold leading-none ${item.tone === 'positive' ? 'text-emerald-700' : item.tone === 'warning' ? 'text-amber-700' : item.tone === 'negative' ? 'text-red-700' : 'text-foreground'}`}>{item.value}</span>
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
          <div className="mobile-scroll">
            <table className="w-full min-w-[640px] text-left">
              <thead className="border-b border-border bg-muted/45">
                <tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">Request</th>
                  <th className="px-3 py-3 font-semibold">Department</th>
                  <th className="px-3 py-3 font-semibold">Destination</th>
                  <th className="px-3 py-3 font-semibold">Date</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((request) => (
                  <tr key={request.id} data-testid={`row-request-${request.id}`} className="text-xs hover:bg-muted/35">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground">{request.requester}</p>
                      <p className="mt-1 data-mono text-[10px] text-muted-foreground">{request.id}</p>
                    </td>
                    <td className="px-3 py-4 text-muted-foreground">{request.department}</td>
                    <td className="px-3 py-4 font-medium text-foreground">{request.destination}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-muted-foreground">{request.requestedDate}</td>
                    <td className="px-3 py-4"><StatusPill status={request.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            {attentionItems.map((item) => (
              <div key={item.id} data-testid={`attention-${item.id}`} className="flex gap-3 px-5 py-4">
                <SeverityMark severity={item.severity} />
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
          <div className="mobile-scroll">
            <table className="w-full min-w-[640px] text-left">
              <thead className="border-b border-border bg-muted/45">
                <tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">Vehicle / driver</th>
                  <th className="px-3 py-3 font-semibold">Destination</th>
                  <th className="px-3 py-3 font-semibold">Departure</th>
                  <th className="px-3 py-3 font-semibold">Expected return</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {trips.map((trip) => (
                  <tr key={trip.id} data-testid={`row-trip-${trip.id}`} className="text-xs hover:bg-muted/35">
                    <td className="px-5 py-4">
                      <p className="data-mono font-semibold text-foreground">{trip.vehicle}</p>
                      <p className="mt-1 text-muted-foreground">{trip.driver}</p>
                    </td>
                    <td className="px-3 py-4 font-medium text-foreground">{trip.destination}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-muted-foreground">{trip.departure}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-muted-foreground">{trip.expectedReturn}</td>
                    <td className="px-3 py-4"><StatusPill status={trip.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            {activity.map((event) => (
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