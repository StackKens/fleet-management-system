import { useState } from 'react';
import { Activity, Eye, Play, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { TableLoading } from '@/components/ui/loading-state';
import { Pagination } from '@/components/ui/pagination';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { useFleetStore } from '@/stores/fleet-store';
import { useTrips } from '@/hooks/use-fleet-data';
import { toast } from '@/hooks/use-toast';
import type { Trip, TripStatus } from '@/data/types';

const statusVariant: Record<TripStatus, 'warning' | 'success' | 'danger' | 'info' | 'default'> = {
  Scheduled: 'default',
  'On route': 'info',
  Returned: 'success',
  Cancelled: 'danger',
};

export default function MyTrips() {
  const { user } = useAuth();
  const { data: trips, isLoading } = useTrips();
  const updateTripStatus = useFleetStore((s) => s.updateTripStatus);

  const [page, setPage] = useState(1);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [startModal, setStartModal] = useState<Trip | null>(null);
  const [completeModal, setCompleteModal] = useState<Trip | null>(null);
  const [endMileage, setEndMileage] = useState('');
  const [fuelUsed, setFuelUsed] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const perPage = 8;

  // Filter to show only current user's trips
  const myTrips = (trips ?? []).filter(
    (t) => t.driver === user?.name || t.driver.includes(user?.name?.split(' ')[0] ?? ''),
  );

  const totalPages = Math.ceil(myTrips.length / perPage);
  const paginated = myTrips.slice((page - 1) * perPage, page * perPage);

  const activeCount = myTrips.filter((t) => t.status === 'On route').length;
  const scheduledCount = myTrips.filter((t) => t.status === 'Scheduled').length;
  const completedCount = myTrips.filter((t) => t.status === 'Returned').length;

  const handleStartTrip = async () => {
    if (!startModal) return;

    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    updateTripStatus(startModal.id, 'On route');

    setActionLoading(false);
    setStartModal(null);

    toast({
      title: 'Trip Started',
      description: `Trip ${startModal.id} is now in progress.`,
    });
  };

  const handleCompleteTrip = async () => {
    if (!completeModal) return;

    const mileage = parseInt(endMileage);
    if (!mileage || mileage <= completeModal.mileageStart) {
      toast({
        title: 'Invalid Mileage',
        description: 'End mileage must be greater than start mileage.',
        variant: 'destructive',
      });
      return;
    }

    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    updateTripStatus(completeModal.id, 'Returned', mileage, fuelUsed ? parseFloat(fuelUsed) : undefined);

    setActionLoading(false);
    setCompleteModal(null);
    setEndMileage('');
    setFuelUsed('');

    toast({
      title: 'Trip Completed',
      description: `Trip ${completeModal.id} has been completed.`,
    });
  };

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="My Trips"
        description="Your assigned trips and their status"
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Total trips</p>
          <p className="data-mono mt-1 text-xl font-semibold">{myTrips.length}</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Scheduled</p>
          <p className="data-mono mt-1 text-xl font-semibold text-amber-700">{scheduledCount}</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">On Route</p>
          <p className="data-mono mt-1 text-xl font-semibold text-sky-700">{activeCount}</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="data-mono mt-1 text-xl font-semibold text-emerald-700">{completedCount}</p>
        </Card>
      </div>

      <Card>
        {isLoading ? (
          <TableLoading />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<Activity className="h-5 w-5" />}
            title="No trips found"
            description="No trips have been assigned to you yet."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Trip</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Destination</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Vehicle</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Departure</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Expected Return</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((trip) => (
                    <tr key={trip.id} className="border-b border-border last:border-b-0">
                      <td className="px-5 py-4">
                        <span className="data-mono font-semibold text-foreground">{trip.id}</span>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-foreground">{trip.destination}</td>
                      <td className="px-5 py-4">
                        <span className="data-mono text-sm text-foreground">{trip.vehicle}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{trip.departure}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{trip.expectedReturn}</td>
                      <td className="px-5 py-4">
                        <Badge variant={statusVariant[trip.status]} dot>
                          {trip.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedTrip(trip)}
                            className="h-7 px-2 text-[11px]"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          {trip.status === 'Scheduled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setStartModal(trip)}
                              className="h-7 px-2 text-[11px]"
                            >
                              <Play className="h-3 w-3" />
                              Start Trip
                            </Button>
                          )}
                          {trip.status === 'On route' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => { setCompleteModal(trip); setEndMileage(''); setFuelUsed(''); }}
                              className="h-7 px-2 text-[11px]"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={myTrips.length}
              perPage={perPage}
            />
          </>
        )}
      </Card>

      {/* View Trip Modal */}
      <Modal
        open={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        title={selectedTrip ? `Trip ${selectedTrip.id}` : ''}
        description={selectedTrip ? `${selectedTrip.destination}` : undefined}
        footer={
          <Button variant="outline" onClick={() => setSelectedTrip(null)}>
            Close
          </Button>
        }
      >
        {selectedTrip && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="mt-1 data-mono font-medium text-foreground">{selectedTrip.vehicle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Driver</p>
                <p className="mt-1 font-medium text-foreground">{selectedTrip.driver}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="mt-1 font-medium text-foreground">{selectedTrip.destination}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Purpose</p>
                <p className="mt-1 font-medium text-foreground">{selectedTrip.purpose}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Departure</p>
                <p className="mt-1 font-medium text-foreground">{selectedTrip.departure}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expected Return</p>
                <p className="mt-1 font-medium text-foreground">{selectedTrip.expectedReturn}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start Mileage</p>
                <p className="mt-1 data-mono font-medium text-foreground">{selectedTrip.mileageStart.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End Mileage</p>
                <p className="mt-1 data-mono font-medium text-foreground">
                  {selectedTrip.mileageEnd ? `${selectedTrip.mileageEnd.toLocaleString()} km` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fuel Used</p>
                <p className="mt-1 data-mono font-medium text-foreground">
                  {selectedTrip.fuelUsed ? `${selectedTrip.fuelUsed} L` : '—'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Start Trip Modal */}
      <Modal
        open={!!startModal}
        onClose={() => setStartModal(null)}
        title={startModal ? `Start Trip ${startModal.id}` : ''}
        description={startModal ? `${startModal.vehicle} — ${startModal.destination}` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => setStartModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleStartTrip} disabled={actionLoading}>
              {actionLoading ? 'Starting...' : 'Start Trip'}
            </Button>
          </>
        }
      >
        {startModal && (
          <div className="space-y-4">
            <div className="rounded-md border border-border bg-muted/30 px-4 py-3 text-sm">
              <p className="font-medium text-foreground">{startModal.vehicle}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {startModal.destination} · Departure: {startModal.departure}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Start mileage: <span className="data-mono font-medium">{startModal.mileageStart.toLocaleString()} km</span>
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Please confirm that you have completed your pre-trip inspection and are ready to begin this trip.
            </p>
          </div>
        )}
      </Modal>

      {/* Complete Trip Modal */}
      <Modal
        open={!!completeModal}
        onClose={() => { setCompleteModal(null); setEndMileage(''); setFuelUsed(''); }}
        title={completeModal ? `Complete Trip ${completeModal.id}` : ''}
        description={completeModal ? `${completeModal.vehicle} — ${completeModal.destination}` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => { setCompleteModal(null); setEndMileage(''); setFuelUsed(''); }}>
              Cancel
            </Button>
            <Button onClick={handleCompleteTrip} disabled={actionLoading || !endMileage}>
              {actionLoading ? 'Completing...' : 'Complete Trip'}
            </Button>
          </>
        }
      >
        {completeModal && (
          <div className="space-y-4">
            <div className="rounded-md border border-border bg-muted/30 px-4 py-3 text-sm">
              <p className="font-medium text-foreground">{completeModal.vehicle}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Start mileage: <span className="data-mono font-medium">{completeModal.mileageStart.toLocaleString()} km</span>
              </p>
            </div>
            <FormField label="End Mileage (km)" required>
              <Input
                type="number"
                value={endMileage}
                onChange={(e) => setEndMileage(e.target.value)}
                placeholder={`Must be greater than ${completeModal.mileageStart.toLocaleString()}`}
                min={completeModal.mileageStart + 1}
              />
            </FormField>
            <FormField label="Fuel Used (L)">
              <Input
                type="number"
                value={fuelUsed}
                onChange={(e) => setFuelUsed(e.target.value)}
                placeholder="Optional"
                min="0"
                step="0.1"
              />
            </FormField>
          </div>
        )}
      </Modal>
    </div>
  );
}
