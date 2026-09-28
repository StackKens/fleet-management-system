import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTrips } from '@/hooks/use-fleet-data';

const statusVariant: Record<string, 'warning' | 'success' | 'danger' | 'info' | 'default'> = {
  Scheduled: 'default',
  'On route': 'info',
  Returned: 'success',
  Cancelled: 'danger',
};

export default function MyTrips() {
  const { data: trips } = useTrips();
  const myTrips = trips ?? [];

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <section className="mb-7 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Driver Workspace</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">My Trips</h2>
        <p className="mt-2 text-sm text-muted-foreground">Your assigned trips and their status</p>
      </section>

      <section className="border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">All Trips</h3>
          <span className="text-xs text-muted-foreground">{myTrips.length} trips</span>
        </div>
        <div className="divide-y divide-border">
          {myTrips.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
              <p className="mt-4 text-sm text-muted-foreground">No trips assigned to you at this time.</p>
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
  );
}
