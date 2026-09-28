import { useParams, Link } from 'wouter';
import {
  ArrowLeft,
  UsersRound,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  Activity,
  Truck,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { useFleetStore } from '@/stores/fleet-store';
import { useDriver, useTrips, useInspections, useIssues } from '@/hooks/use-fleet-data';
import { driverStatusVariant } from '@/data/status-variants';

export default function DriverDetail() {
  const { id } = useParams();
  const { data: driver } = useDriver(id ?? '');
  const { data: trips } = useTrips();
  const { data: inspections } = useFleetStore((s) => s.inspections) ? useInspections() : { data: [] };
  const { data: issues } = useFleetStore((s) => s.issues) ? useIssues() : { data: [] };

  if (!driver) {
    return (
      <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="py-12 text-center">
          <UsersRound className="mx-auto h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-muted-foreground">Driver not found.</p>
          <Link href="/drivers" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            Back to Drivers
          </Link>
        </div>
      </div>
    );
  }

  const driverTrips = (trips ?? []).filter((t) => t.driver === driver.name);
  const driverInspections = (inspections ?? []).filter((i) => i.submittedBy === driver.name);
  const driverIssues = (issues ?? []).filter((i) => i.reportedBy === driver.name);
  const totalDistance = driverTrips.reduce((sum, t) => sum + (t.mileageEnd ? t.mileageEnd - t.mileageStart : 0), 0);

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <div className="mb-6">
        <Link href="/drivers" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Drivers
        </Link>
      </div>

      <div className="mb-7 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div className="flex items-center gap-4">
          <Avatar name={driver.name} size="lg" />
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Driver Profile</p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
              {driver.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{driver.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={driverStatusVariant[driver.status] ?? 'default'} dot>
            {driver.status}
          </Badge>
        </div>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Trips Completed</p>
          <p className="data-mono mt-1 text-xl font-semibold">{driver.tripsCompleted}</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Total Distance</p>
          <p className="data-mono mt-1 text-xl font-semibold">{totalDistance.toLocaleString()} km</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Rating</p>
          <div className="mt-1 flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="data-mono text-xl font-semibold">{driver.rating}</span>
          </div>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Assigned Vehicle</p>
          <p className="data-mono mt-1 text-xl font-semibold">{driver.assignedVehicle ?? '—'}</p>
        </Card>
      </div>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <div className="space-y-7">
          <section className="border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>
            </div>
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="mt-0.5 font-medium text-foreground">{driver.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="mt-0.5 font-medium text-foreground">{driver.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">License Number</p>
                  <p className="data-mono mt-0.5 font-medium text-foreground">{driver.licenseNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">License Expiry</p>
                  <p className="mt-0.5 font-medium text-foreground">{driver.licenseExpiry}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Recent Trips</h3>
            </div>
            <div className="divide-y divide-border">
              {driverTrips.length === 0 ? (
                <div className="px-5 py-6 text-center text-sm text-muted-foreground">No trips recorded for this driver.</div>
              ) : (
                driverTrips.slice(0, 5).map((trip) => (
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
              <h3 className="text-sm font-semibold text-foreground">Inspections Submitted</h3>
            </div>
            <div className="divide-y divide-border">
              {driverInspections.length === 0 ? (
                <div className="px-5 py-6 text-center text-sm text-muted-foreground">No inspections submitted by this driver.</div>
              ) : (
                driverInspections.slice(0, 5).map((inspection) => (
                  <div key={inspection.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{inspection.type} inspection</p>
                      <p className="text-[11px] text-muted-foreground">{inspection.vehicle} · {inspection.date}</p>
                    </div>
                    <Badge variant={inspection.result === 'Passed' ? 'success' : inspection.result === 'Failed' ? 'danger' : 'warning'} dot>
                      {inspection.result}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-7">
          <section className="border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Issues Reported</h3>
            </div>
            <div className="divide-y divide-border">
              {driverIssues.length === 0 ? (
                <div className="px-5 py-6 text-center text-sm text-muted-foreground">No issues reported by this driver.</div>
              ) : (
                driverIssues.slice(0, 5).map((issue) => (
                  <div key={issue.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-foreground">{issue.type}</p>
                      <Badge variant={issue.status === 'Resolved' ? 'success' : issue.status === 'In progress' ? 'info' : 'warning'} dot>
                        {issue.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {issue.vehicle} · {issue.severity} · {issue.date}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Employment</h3>
            </div>
            <div className="space-y-3 px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium text-foreground">{driver.department}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Join Date</span>
                <span className="font-medium text-foreground">{driver.joinDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={driverStatusVariant[driver.status] ?? 'default'} dot>
                  {driver.status}
                </Badge>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
