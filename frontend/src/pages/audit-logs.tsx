import { ScrollText, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useActivity } from '@/hooks/use-fleet-data';

const typeVariant: Record<string, 'default' | 'info' | 'success' | 'warning' | 'danger'> = {
  assignment: 'info',
  request: 'warning',
  maintenance: 'success',
  system: 'default',
  fuel: 'info',
  trip: 'success',
};

export default function AuditLogs() {
  const { data: activity } = useActivity();

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <section className="mb-7 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Admin Workspace</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Audit Logs</h2>
        <p className="mt-2 text-sm text-muted-foreground">View system activity and audit trail</p>
      </section>

      <section className="border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">System Activity</h3>
          <span className="text-xs text-muted-foreground">{activity?.length ?? 0} events</span>
        </div>
        <div className="divide-y divide-border">
          {activity?.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <ScrollText className="mx-auto h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
              <p className="mt-4 text-sm text-muted-foreground">No audit logs available.</p>
            </div>
          ) : (
            activity?.map((event) => (
              <div key={event.id} className="flex items-start justify-between px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
                    <Activity className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{event.message}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{event.timestamp}</p>
                  </div>
                </div>
                <Badge variant={typeVariant[event.type] ?? 'default'}>
                  {event.type}
                </Badge>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
