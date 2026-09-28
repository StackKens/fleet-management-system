import { useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useFuelRecords, useVehicles } from '@/hooks/use-fleet-data';
import { toast } from '@/hooks/use-toast';
import type { FuelType } from '@/data/types';

type FuelFormData = {
  vehicle: string;
  driver: string;
  date: string;
  liters: string;
  costPerLiter: string;
  mileage: string;
  fuelStation: string;
  fuelType: FuelType;
};

const emptyForm: FuelFormData = {
  vehicle: '',
  driver: '',
  date: '',
  liters: '',
  costPerLiter: '',
  mileage: '',
  fuelStation: '',
  fuelType: 'Diesel',
};

export default function Fuel() {
  const { data: records, isLoading } = useFuelRecords();
  const { data: vehicles } = useVehicles();
  const addFuelRecord = useFleetStore((s) => s.addFuelRecord);
  const deleteFuelRecord = useFleetStore((s) => s.deleteFuelRecord);

  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<FuelFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<FuelFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const perPage = 8;

  const vehicleOptions = [...new Set((records ?? []).map((r) => r.vehicle))];

  const filtered = (records ?? []).filter((r) => {
    const matchesSearch =
      !search ||
      r.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      r.driver.toLowerCase().includes(search.toLowerCase()) ||
      r.fuelStation.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchesVehicle = !vehicleFilter || r.vehicle === vehicleFilter;
    return matchesSearch && matchesVehicle;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const totalLiters = filtered.reduce((sum, r) => sum + r.liters, 0);
  const totalCost = filtered.reduce((sum, r) => sum + r.totalCost, 0);

  const validateForm = (): boolean => {
    const errors: Partial<FuelFormData> = {};
    if (!formData.vehicle) errors.vehicle = 'Vehicle is required';
    if (!formData.driver.trim()) errors.driver = 'Driver is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.liters || parseFloat(formData.liters) <= 0) errors.liters = 'Valid quantity is required';
    if (!formData.costPerLiter || parseFloat(formData.costPerLiter) <= 0) errors.costPerLiter = 'Valid cost is required';
    if (!formData.mileage || parseInt(formData.mileage) < 0) errors.mileage = 'Valid mileage is required';
    if (!formData.fuelStation.trim()) errors.fuelStation = 'Fuel station is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const liters = parseFloat(formData.liters);
    const costPerLiter = parseFloat(formData.costPerLiter);

    addFuelRecord({
      vehicle: formData.vehicle,
      driver: formData.driver.trim(),
      date: formData.date,
      liters,
      costPerLiter,
      totalCost: liters * costPerLiter,
      mileage: parseInt(formData.mileage),
      fuelStation: formData.fuelStation.trim(),
      fuelType: formData.fuelType,
    });

    setSubmitting(false);
    setAddModal(false);
    setFormData(emptyForm);
    setFormErrors({});

    toast({
      title: 'Fuel Record Added',
      description: `Fuel record for ${formData.vehicle} has been added successfully.`,
    });
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    deleteFuelRecord(deleteConfirm);
    toast({
      title: 'Record Deleted',
      description: 'Fuel record has been deleted.',
    });
    setDeleteConfirm(null);
  };

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Fuel"
        description="Fuel issues, consumption records and cost controls."
        actions={
          <Button onClick={() => { setFormData(emptyForm); setFormErrors({}); setAddModal(true); }}>
            <Plus className="h-4 w-4" />
            Add fuel record
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Total records</p>
          <p className="data-mono mt-1 text-xl font-semibold">{filtered.length}</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Total liters</p>
          <p className="data-mono mt-1 text-xl font-semibold">{totalLiters.toLocaleString()} L</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Total cost</p>
          <p className="data-mono mt-1 text-xl font-semibold">UGX {(totalCost / 1000000).toFixed(1)}M</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Avg cost/L</p>
          <p className="data-mono mt-1 text-xl font-semibold">
            UGX {totalLiters > 0 ? Math.round(totalCost / totalLiters).toLocaleString() : 0}
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search vehicle, driver, station..."
              className="pl-9"
            />
          </div>
          <Select
            value={vehicleFilter}
            onChange={(e) => { setVehicleFilter(e.target.value); setPage(1); }}
            className="sm:max-w-[160px]"
          >
            <option value="">All vehicles</option>
            {vehicleOptions.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </Select>
        </div>

        {isLoading ? (
          <TableLoading />
        ) : paginated.length === 0 ? (
          <EmptyState
            title="No fuel records found"
            description={search || vehicleFilter ? 'Try adjusting your search or filters.' : 'No fuel records have been added yet.'}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Liters</TableHead>
                  <TableHead>Cost/L</TableHead>
                  <TableHead>Total cost</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <span className="data-mono font-semibold text-foreground">{record.id}</span>
                    </TableCell>
                    <TableCell>
                      <span className="data-mono font-medium text-primary">
                        {record.vehicle}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{record.driver}</TableCell>
                    <TableCell className="text-muted-foreground">{record.date}</TableCell>
                    <TableCell className="data-mono">{record.liters} L</TableCell>
                    <TableCell className="data-mono">UGX {record.costPerLiter.toLocaleString()}</TableCell>
                    <TableCell className="data-mono font-semibold text-foreground">
                      UGX {record.totalCost.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{record.fuelStation}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirm(record.id)}
                        className="h-7 px-2 text-[11px] text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
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

      {/* Add Fuel Record Modal */}
      <Modal
        open={addModal}
        onClose={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}
        title="Add Fuel Record"
        description="Record a new fuel purchase"
        footer={
          <>
            <Button variant="outline" onClick={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handleAddRecord} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Record'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddRecord} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Vehicle" required error={formErrors.vehicle}>
              <Select value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}>
                <option value="">Select vehicle...</option>
                {(vehicles ?? []).map((v) => (
                  <option key={v.id} value={v.registration}>
                    {v.registration} — {v.make} {v.model}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Driver" required error={formErrors.driver}>
              <Input
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                placeholder="Driver name"
              />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Date" required error={formErrors.date}>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </FormField>
            <FormField label="Fuel Type">
              <Select value={formData.fuelType} onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as FuelType })}>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Liters" required error={formErrors.liters}>
              <Input
                type="number"
                step="0.01"
                value={formData.liters}
                onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                placeholder="0.00"
              />
            </FormField>
            <FormField label="Cost per Liter (UGX)" required error={formErrors.costPerLiter}>
              <Input
                type="number"
                value={formData.costPerLiter}
                onChange={(e) => setFormData({ ...formData, costPerLiter: e.target.value })}
                placeholder="e.g., 5200"
              />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Mileage (km)" required error={formErrors.mileage}>
              <Input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                placeholder="Current mileage"
              />
            </FormField>
            <FormField label="Fuel Station" required error={formErrors.fuelStation}>
              <Input
                value={formData.fuelStation}
                onChange={(e) => setFormData({ ...formData, fuelStation: e.target.value })}
                placeholder="e.g., Shell Kampala Road"
              />
            </FormField>
          </div>
          {formData.liters && formData.costPerLiter && (
            <div className="rounded-md border border-border bg-muted/30 px-4 py-3 text-sm">
              <p className="text-muted-foreground">Total Cost</p>
              <p className="data-mono mt-1 text-lg font-semibold text-foreground">
                UGX {(parseFloat(formData.liters) * parseFloat(formData.costPerLiter)).toLocaleString()}
              </p>
            </div>
          )}
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Fuel Record"
        description="Are you sure you want to delete this fuel record? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
