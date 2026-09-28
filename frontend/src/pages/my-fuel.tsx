import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFuelRecords } from '@/hooks/use-fleet-data';

export default function MyFuel() {
  const { data: fuelRecords } = useFuelRecords();
  const myRecords = fuelRecords?.slice(0, 5) ?? [];

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <section className="mb-7 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Driver Workspace</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">My Fuel Records</h2>
        <p className="mt-2 text-sm text-muted-foreground">Submit and view your fuel submissions</p>
      </section>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <section className="border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Submit Fuel Record</h3>
          </div>
          <div className="px-5 py-5">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Vehicle</label>
                <select className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm">
                  <option>UG 1234 A</option>
                  <option>UG 5678 B</option>
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Liters</label>
                  <input type="number" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Cost per Liter</label>
                  <input type="number" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Mileage (km)</label>
                <input type="number" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" placeholder="Enter current mileage" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Fuel Station</label>
                <input type="text" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" placeholder="Enter station name" />
              </div>
              <Button className="w-full">
                <CheckCircle2 className="h-4 w-4" />
                Submit Fuel Record
              </Button>
            </div>
          </div>
        </section>

        <section className="border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Submissions</h3>
          </div>
          <div className="divide-y divide-border">
            {myRecords.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No fuel records submitted yet.
              </div>
            ) : (
              myRecords.map((record) => (
                <div key={record.id} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">{record.fuelStation}</p>
                    <Badge variant="success" dot>Submitted</Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {record.liters}L · UGX {record.totalCost.toLocaleString()} · {record.date}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
