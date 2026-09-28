import { Truck, FileText, Fuel, Activity } from 'lucide-react';
import { useVehicle } from '@/hooks/use-fleet-data';
import { Badge } from '@/components/ui/badge';

export default function MyVehicle() {
  // In a real app, this would fetch the vehicle assigned to the logged-in driver
  const { data: vehicle } = useVehicle('VEH-001');

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <section className="mb-7 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Driver Workspace</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">My Vehicle</h2>
        <p className="mt-2 text-sm text-muted-foreground">Your assigned vehicle details and status</p>
      </section>

      {vehicle ? (
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
          <section className="border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Vehicle Details</h3>
              <Badge variant="success" dot>{vehicle.status}</Badge>
            </div>
            <div className="px-5 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
                  <Truck className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{vehicle.registration}</p>
                  <p className="text-sm text-muted-foreground">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Vehicle Type</p>
                  <p className="mt-1 text-sm text-foreground">{vehicle.vehicleType}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Fuel Type</p>
                  <p className="mt-1 text-sm text-foreground">{vehicle.fuelType}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Mileage</p>
                  <p className="mt-1 text-sm text-foreground">{vehicle.mileage.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Department</p>
                  <p className="mt-1 text-sm text-foreground">{vehicle.department}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Last Service</p>
                  <p className="mt-1 text-sm text-foreground">{vehicle.lastService}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Next Service</p>
                  <p className="mt-1 text-sm text-foreground">{vehicle.nextService}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Insurance Expiry</p>
                  <p className="mt-1 text-sm text-foreground">{vehicle.insuranceExpiry}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Inspection Expiry</p>
                  <p className="mt-1 text-sm text-foreground">{vehicle.inspectionExpiry}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
            </div>
            <div className="space-y-2 px-5 py-4">
              <a href="/inspections" className="flex items-center gap-3 rounded-md border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Submit Inspection
              </a>
              <a href="/my-fuel" className="flex items-center gap-3 rounded-md border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50">
                <Fuel className="h-4 w-4 text-muted-foreground" />
                Submit Fuel Record
              </a>
              <a href="/report-issue" className="flex items-center gap-3 rounded-md border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Report an Issue
              </a>
            </div>
          </section>
        </div>
      ) : (
        <div className="border border-border bg-card px-5 py-12 text-center">
          <Truck className="mx-auto h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-muted-foreground">No vehicle currently assigned to you.</p>
        </div>
      )}
    </div>
  );
}
