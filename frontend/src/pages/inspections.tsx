import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Inspections() {

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <section className="mb-7 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Driver Workspace</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Vehicle Inspections</h2>
        <p className="mt-2 text-sm text-muted-foreground">Submit and view your vehicle inspection records</p>
      </section>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <section className="border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Submit New Inspection</h3>
          </div>
          <div className="px-5 py-5">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Inspection Type</label>
                <select className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm">
                  <option>Pre-trip inspection</option>
                  <option>Post-trip inspection</option>
                  <option>Weekly inspection</option>
                  <option>Monthly inspection</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Vehicle</label>
                <select className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm">
                  <option>UG 1234 A</option>
                  <option>UG 5678 B</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Mileage (km)</label>
                <input type="number" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" placeholder="Enter current mileage" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Notes</label>
                <textarea className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" rows={3} placeholder="Any issues or observations..." />
              </div>
              <Button className="w-full">
                <CheckCircle2 className="h-4 w-4" />
                Submit Inspection
              </Button>
            </div>
          </div>
        </section>

        <section className="border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Inspections</h3>
          </div>
          <div className="divide-y divide-border">
            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">Pre-trip inspection</p>
                <Badge variant="success" dot>Passed</Badge>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">UG 1234 A · 2024-07-15</p>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">Post-trip inspection</p>
                <Badge variant="success" dot>Passed</Badge>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">UG 1234 A · 2024-07-14</p>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">Weekly inspection</p>
                <Badge variant="warning" dot>Pending</Badge>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">UG 1234 A · 2024-07-13</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
