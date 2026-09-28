import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export default function RequestVehicle() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <section className="mb-7 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Staff Workspace</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Request a Vehicle</h2>
        <p className="mt-2 text-sm text-muted-foreground">Submit a new vehicle request for your department</p>
      </section>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <section className="border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">New Request</h3>
          </div>
          <div className="px-5 py-5">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label>
                <input type="text" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" value={user?.department ?? ''} readOnly />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Destination</label>
                <input type="text" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" placeholder="Enter destination" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Purpose</label>
                <textarea className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" rows={3} placeholder="Describe the purpose of this trip..." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Start Date</label>
                  <input type="date" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">End Date</label>
                  <input type="date" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Number of Passengers</label>
                <input type="number" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" placeholder="1" />
              </div>
              <Button className="w-full">
                <CheckCircle2 className="h-4 w-4" />
                Submit Request
              </Button>
            </div>
          </div>
        </section>

        <section className="border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Request Guidelines</h3>
          </div>
          <div className="px-5 py-4">
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                Submit requests at least 24 hours in advance
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                Include clear purpose and destination details
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                Requests are reviewed by the Fleet Manager
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                You will be notified once approved or declined
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
