import { useParams, Link } from 'wouter';
import {
  ArrowLeft,
  Truck,
  Edit,
  Wrench,
  Fuel,
  Activity,
  FileText,
  ShieldCheck,
  CalendarDays,
  Gauge,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useFleetStore } from '@/stores/fleet-store';
import { useVehicle, useFuelRecords, useTrips, useMaintenanceRecords } from '@/hooks/use-fleet-data';
import { vehicleStatusVariant } from '@/data/status-variants';
import { toast } from '@/hooks/use-toast';

export default function VehicleDetail() {
  const { id } = useParams();
  const { data: vehicle } = useVehicle(id ?? '');
  const { data: fuelRecords } = useFuelRecords();
  const { data: trips } = useTrips();
  const { data: maintenanceRecords } = useMaintenanceRecords();
  const updateVehicleStatus = useFleetStore((s) => s.updateVehicleStatus);

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="py-12 text-center">
          <Truck className="mx-auto h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-muted-foreground">Vehicle not found.</p>
          <Link href="/vehicles" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  const vehicleFuel = (fuelRecords ?? []).filter((f) => f.vehicle === vehicle.registration);
  const vehicleTrips = (trips ?? []).filter((t) => t.vehicle === vehicle.registration);
  const vehicleMaintenance = (maintenanceRecords ?? []).filter((m) => m.vehicle === vehicle.registration);

  const totalFuelCost = vehicleFuel.reduce((sum, f) => sum + f.totalCost, 0);
  const totalMaintenanceCost = vehicleMaintenance.reduce((sum, m) => sum + m.cost, 0);
  const totalDistance = vehicleTrips.reduce((sum, t) => sum + (t.mileageEnd ? t.mileageEnd - t.mileageStart : 0), 0);

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <div className="mb-6">
        <Link href="/vehicles" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Vehicles
        </Link>
      </div>

      <div className="mb-7 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Vehicle Details</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
            {vehicle.registration}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={vehicleStatusVariant[vehicle.status] ?? 'default'} dot>
            {vehicle.status}
          </Badge>
          {vehicle.status !== 'Maintenance' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateVehicleStatus(vehicle.id, 'Maintenance');
                toast({ title: 'Vehicle Sent to Maintenance', description: `${vehicle.registration} status updated.` });
              }}
            >
              <Wrench className="h-3.5 w-3.5" />
              Send to Maintenance
            </Button>
          )}
        </div>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Mileage</p>
          <p className="data-mono mt-1 text-xl font-semibold">{vehicle.mileage.toLocaleString()} km</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Total Trips</p>
          <p className="data-mono mt-1 text-xl font-semibold">{vehicleTrips.length}</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Total Distance</p>
          <p className="data-mono mt-1 text-xl font-semibold">{totalDistance.toLocaleString()} km</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Fuel Spend</p>
          <p className="data-mono mt-1 text-xl font-semibold">UGX {(totalFuelCost / 1000000).toFixed(1)}M</p>
        </Card>
      </div>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <div className="space-y-7">
          <section className="border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Vehicle Information</h3>
            </div>
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Registration</p>
                <p className="data-mono mt-1 font-medium text-foreground">{vehicle.registration}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Make & Model</p>
                <p className="mt-1 font-medium text-foreground">{vehicle.make} {vehicle.model}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Year</p>
                <p className="mt-1 font-medium text-foreground">{vehicle.year}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vehicle Type</p>
                <p className="mt-1 font-medium text-foreground">{vehicle.vehicleType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Color</p>
                <p className="mt-1 font-medium text-foreground">{vehicle.color}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fuel Type</p>
                <p className="mt-1 font-medium text-foreground">{vehicle.fuelType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="mt-1 font-medium text-foreground">{vehicle.department}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Assigned Driver</p>
                <p className="mt-1 font-medium text-foreground">{vehicle.driver ?? 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant={vehicleStatusVariant[vehicle.status] ?? 'default'} dot>
                  {vehicle.status}
                </Badge>
              </div>
            </div>
          </section>

          <section className="border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Service & Compliance</h3>
            </div>
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Last Service</p>
                <p className="mt-1 font-medium text-foreground">{vehicle.lastService}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next Service</p>
                <p className="mt-1 font-medium text-foreground">{vehicle.nextService}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Insurance Expiry</p>
                <p className="mt-1 font-medium text-foreground">{vehicle.insuranceExpiry}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Inspection Expiry</p>
                <p className="mt-1 font-medium text-foreground">{vehicle.inspectionExpiry}</p>
              </div>
            </div>
          </section>

          <section className="border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Recent Trips</h3>
            </div>
            <div className="divide-y divide-border">
              {vehicleTrips.length === 0 ? (
                <div className="px-5 py-6 text-center text-sm text-muted-foreground">No trips recorded for this vehicle.</div>
              ) : (
                vehicleTrips.slice(0, 5).map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{trip.destination}</p>
                      <p className="text-[11px] text-muted-foreground">{trip.departure}</p>
                    </div>
                    <Badge variant={trip.status === 'Returned' ? 'success' : trip.status === 'On route' ? 'info' : 'warning'} dot>
                      {trip.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Maintenance History</h3>
            </div>
            <div className="divide-y divide-border">
              {vehicleMaintenance.length === 0 ? (
                <div className="px-5 py-6 text-center text-sm text-muted-foreground">No maintenance records for this vehicle.</div>
              ) : (
                vehicleMaintenance.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{record.type}</p>
                      <p className="text-[11px] text-muted-foreground">{record.description.slice(0, 60)}...</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={record.status === 'Completed' ? 'success' : record.status === 'In progress' ? 'info' : 'warning'} dot>
                        {record.status}
                      </Badge>
                      {record.cost > 0 && (
                        <p className="data-mono mt-1 text-[11px] text-muted-foreground">UGX {record.cost.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-7">
          <section className="border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Fuel History</h3>
            </div>
            <div className="divide-y divide-border">
              {vehicleFuel.length === 0 ? (
                <div className="px-5 py-6 text-center text-sm text-muted-foreground">No fuel records for this vehicle.</div>
              ) : (
                vehicleFuel.slice(0, 5).map((record) => (
                  <div key={record.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-foreground">{record.fuelStation}</p>
                      <p className="data-mono text-[11px] text-muted-foreground">{record.liters} L</p>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      UGX {record.totalCost.toLocaleString()} · {record.date}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Cost Summary</h3>
            </div>
            <div className="space-y-3 px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Fuel Cost</span>
                <span className="data-mono font-medium text-foreground">UGX {totalFuelCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Maintenance</span>
                <span className="data-mono font-medium text-foreground">UGX {totalMaintenanceCost.toLocaleString()}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Total Operating Cost</span>
                  <span className="data-mono font-semibold text-foreground">UGX {(totalFuelCost + totalMaintenanceCost).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
