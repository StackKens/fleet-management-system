import { ClipboardList } from 'lucide-react';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRequests } from '@/hooks/use-fleet-data';

const statusVariant: Record<string, 'warning' | 'success' | 'danger' | 'info' | 'default'> = {
  Pending: 'warning',
  Approved: 'success',
  Declined: 'danger',
  Completed: 'default',
};

export default function MyRequests() {
  const { data: requests } = useRequests();
  const myRequests = requests ?? [];

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <section className="mb-7 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Staff Workspace</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">My Requests</h2>
          <p className="mt-2 text-sm text-muted-foreground">Track your vehicle requests and their status</p>
        </div>
        <Link href="/request-vehicle" data-testid="link-new-request">
          <Button size="sm">
            <ClipboardList className="h-3.5 w-3.5" />
            New Request
          </Button>
        </Link>
      </section>

      <section className="border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">All Requests</h3>
          <span className="text-xs text-muted-foreground">{myRequests.length} requests</span>
        </div>
        <div className="divide-y divide-border">
          {myRequests.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
              <p className="mt-4 text-sm text-muted-foreground">No requests yet. Request a vehicle to get started.</p>
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
                      {request.startDate} → {request.endDate} · {request.purpose}
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
    </div>
  );
}
