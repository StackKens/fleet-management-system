import { useState } from 'react';
import { Plus, Activity, Search, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FormField } from '@/components/ui/form-field';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { TableLoading } from '@/components/ui/loading-state';
import { Pagination } from '@/components/ui/pagination';
import { Modal } from '@/components/ui/modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useFleetStore } from '@/stores/fleet-store';
import { useTrips, useVehicles, useDrivers } from '@/hooks/use-fleet-data';
import { toast } from '@/hooks/use-toast';
import type { TripStatus } from '@/data/types';

const statusVariant: Record<TripStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  Scheduled: 'warning',
  'On route': 'info',
  Returned: 'success',
  Cancelled: 'danger',
};

type TripFormData = {
  vehicle: string;
  driver: string;
  destination: string;
  departure: string;
  expectedReturn: string;
  purpose: string;
};

const emptyForm: TripFormData = {
  vehicle: '',
  driver: '',
  destination: '',
  departure: '',
  expectedReturn: '',
  purpose: '',
};

export default function Trips() {
  const { data: trips, isLoading } = useTrips();
  const { data: vehicles } = useVehicles();
  const { data: drivers } = useDrivers();
  const addTrip = useFleetStore((s) => s.addTrip);
  const deleteTrip = useFleetStore((s) => s.deleteTrip);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<TripFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<TripFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const perPage = 8;

  const filtered = (trips ?? []).filter((t) => {
    const matchesSearch =
      !search ||
      t.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      t.driver.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const activeCount = (trips ?? []).filter((t) => t.status === 'On route').length;

  const availableVehicles = (vehicles ?? []).filter((v) => v.status === 'Available');
  const availableDrivers = (drivers ?? []).filter((d) => d.status === 'Active' && !d.assignedVehicle);

  const validateForm = (): boolean => {
    const errors: Partial<TripFormData> = {};
    if (!formData.vehicle) errors.vehicle = 'Vehicle is required';
    if (!formData.driver) errors.driver = 'Driver is required';
    if (!formData.destination.trim()) errors.destination = 'Destination is required';
    if (!formData.departure.trim()) errors.departure = 'Departure is required';
    if (!formData.expectedReturn.trim()) errors.expectedReturn = 'Expected return is required';
    if (!formData.purpose.trim()) errors.purpose = 'Purpose is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const vehicle = vehicles?.find((v) => v.registration === formData.vehicle);

    addTrip({
      vehicle: formData.vehicle,
      driver: formData.driver,
      destination: formData.destination.trim(),
      departure: formData.departure.trim(),
      expectedReturn: formData.expectedReturn.trim(),
      purpose: formData.purpose.trim(),
      mileageStart: vehicle?.mileage ?? 0,
    });

    setSubmitting(false);
    setAddModal(false);
    setFormData(emptyForm);
    setFormErrors({});

    toast({
      title: 'Trip Scheduled',
      description: `Trip to ${formData.destination} has been scheduled.`,
    });
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    deleteTrip(deleteConfirm);
    toast({
      title: 'Trip Deleted',
      description: 'Trip has been removed.',
    });
    setDeleteConfirm(null);
  };

  const selectedTripData = selectedTrip ? (trips ?? []).find((t) => t.id === selectedTrip) : null;

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Trips"
        description="Trip scheduling, dispatch status and return tracking."
        actions={
          <Button onClick={() => { setFormData(emptyForm); setFormErrors({}); setAddModal(true); }}>
            <Plus className="h-4 w-4" />
            Schedule trip
          </Button>
        }
      />

      {activeCount > 0 && (
        <div className="mb-6 border border-sky-200 bg-sky-50 px-5 py-3 text-xs text-sky-800">
          <span className="font-semibold">{activeCount} trip{activeCount > 1 ? 's' : ''}</span> currently on route
        </div>
      )}

      <Card>
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search vehicle, driver, destination..."
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="sm:max-w-[160px]"
          >
            <option value="">All statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="On route">On route</option>
            <option value="Returned">Returned</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </div>

        {isLoading ? (
          <TableLoading />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<Activity className="h-5 w-5" />}
            title="No trips found"
            description={search || statusFilter ? 'Try adjusting your search or filters.' : 'No trips have been scheduled yet.'}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip</TableHead>
                  <TableHead>Vehicle / Driver</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Expected return</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <span className="data-mono font-semibold text-foreground">{trip.id}</span>
                    </TableCell>
                    <TableCell>
                      <p className="data-mono font-medium text-foreground">{trip.vehicle}</p>
                      <p className="text-[11px] text-muted-foreground">{trip.driver}</p>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{trip.destination}</TableCell>
                    <TableCell className="text-muted-foreground">{trip.departure}</TableCell>
                    <TableCell className="text-muted-foreground">{trip.expectedReturn}</TableCell>
                    <TableCell className="data-mono">
                      {trip.mileageEnd
                        ? `${(trip.mileageEnd - trip.mileageStart).toLocaleString()} km`
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[trip.status]} dot>
                        {trip.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedTrip(trip.id)}
                          className="h-7 px-2 text-[11px]"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(trip.id)}
                          className="h-7 px-2 text-[11px] text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={filtered.length}
              perPage={perPage}
            />
          </>
        )}
      </Card>

      {/* Schedule Trip Modal */}
      <Modal
        open={addModal}
        onClose={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}
        title="Schedule New Trip"
        description="Create a new trip assignment"
        footer={
          <>
            <Button variant="outline" onClick={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handleAddTrip} disabled={submitting}>
              {submitting ? 'Scheduling...' : 'Schedule Trip'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddTrip} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Vehicle" required error={formErrors.vehicle}>
              <Select value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}>
                <option value="">Select available vehicle...</option>
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.registration}>
                    {v.registration} — {v.make} {v.model}
                  </option>
                ))}
              </Select>
              {availableVehicles.length === 0 && (
                <p className="mt-1 text-xs text-destructive">No vehicles currently available</p>
              )}
            </FormField>
            <FormField label="Driver" required error={formErrors.driver}>
              <Select value={formData.driver} onChange={(e) => setFormData({ ...formData, driver: e.target.value })}>
                <option value="">Select available driver...</option>
                {availableDrivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} — {d.department}
                  </option>
                ))}
              </Select>
              {availableDrivers.length === 0 && (
                <p className="mt-1 text-xs text-destructive">No drivers currently available</p>
              )}
            </FormField>
          </div>
          <FormField label="Destination" required error={formErrors.destination}>
            <Input value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} placeholder="Enter destination" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Departure" required error={formErrors.departure}>
              <Input value={formData.departure} onChange={(e) => setFormData({ ...formData, departure: e.target.value })} placeholder="e.g., Tomorrow, 06:00" />
            </FormField>
            <FormField label="Expected Return" required error={formErrors.expectedReturn}>
              <Input value={formData.expectedReturn} onChange={(e) => setFormData({ ...formData, expectedReturn: e.target.value })} placeholder="e.g., Tomorrow, 18:00" />
            </FormField>
          </div>
          <FormField label="Purpose" required error={formErrors.purpose}>
            <Input value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} placeholder="Trip purpose" />
          </FormField>
        </form>
      </Modal>

      {/* View Trip Modal */}
      <Modal
        open={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        title={selectedTripData ? `Trip ${selectedTripData.id}` : ''}
        description={selectedTripData ? `${selectedTripData.vehicle} — ${selectedTripData.destination}` : undefined}
        footer={
          <Button variant="outline" onClick={() => setSelectedTrip(null)}>
            Close
          </Button>
        }
      >
        {selectedTripData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="mt-1 data-mono font-medium text-foreground">{selectedTripData.vehicle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Driver</p>
                <p className="mt-1 font-medium text-foreground">{selectedTripData.driver}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="mt-1 font-medium text-foreground">{selectedTripData.destination}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Purpose</p>
                <p className="mt-1 font-medium text-foreground">{selectedTripData.purpose}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Departure</p>
                <p className="mt-1 font-medium text-foreground">{selectedTripData.departure}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expected Return</p>
                <p className="mt-1 font-medium text-foreground">{selectedTripData.expectedReturn}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start Mileage</p>
                <p className="mt-1 data-mono font-medium text-foreground">{selectedTripData.mileageStart.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End Mileage</p>
                <p className="mt-1 data-mono font-medium text-foreground">
                  {selectedTripData.mileageEnd ? `${selectedTripData.mileageEnd.toLocaleString()} km` : '—'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Trip"
        description="Are you sure you want to delete this trip? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
