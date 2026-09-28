import { useState } from 'react';
import { Link } from 'wouter';
import { Plus, Truck, Search, Edit, Trash2, Wrench } from 'lucide-react';
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
import { useVehicles, useVehicleSummary } from '@/hooks/use-fleet-data';
import { toast } from '@/hooks/use-toast';
import type { VehicleStatus, FuelType } from '@/data/types';

const statusVariant: Record<VehicleStatus, 'success' | 'info' | 'warning' | 'danger'> = {
  Available: 'success',
  Assigned: 'info',
  'In service': 'warning',
  Maintenance: 'danger',
};

type VehicleFormData = {
  registration: string;
  make: string;
  model: string;
  vehicleType: string;
  year: string;
  color: string;
  fuelType: FuelType;
  mileage: string;
  department: string;
  lastService: string;
  nextService: string;
  insuranceExpiry: string;
  inspectionExpiry: string;
};

const emptyForm: VehicleFormData = {
  registration: '',
  make: '',
  model: '',
  vehicleType: '',
  year: '',
  color: '',
  fuelType: 'Diesel',
  mileage: '',
  department: '',
  lastService: '',
  nextService: '',
  insuranceExpiry: '',
  inspectionExpiry: '',
};

export default function Vehicles() {
  const { data: vehicles, isLoading } = useVehicles();
  const { data: summary } = useVehicleSummary();
  const addVehicle = useFleetStore((s) => s.addVehicle);
  const updateVehicle = useFleetStore((s) => s.updateVehicle);
  const updateVehicleStatus = useFleetStore((s) => s.updateVehicleStatus);
  const deleteVehicle = useFleetStore((s) => s.deleteVehicle);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [maintenanceVehicle, setMaintenanceVehicle] = useState<string | null>(null);
  const [formData, setFormData] = useState<VehicleFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<VehicleFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const perPage = 8;

  const filtered = (vehicles ?? []).filter((v) => {
    const matchesSearch =
      !search ||
      v.registration.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.driver?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const editingVehicle = editVehicle ? (vehicles ?? []).find((v) => v.id === editVehicle) : null;

  const validateForm = (): boolean => {
    const errors: Partial<VehicleFormData> = {};
    if (!formData.registration.trim()) errors.registration = 'Registration is required';
    if (!formData.make.trim()) errors.make = 'Make is required';
    if (!formData.model.trim()) errors.model = 'Model is required';
    if (!formData.vehicleType.trim()) errors.vehicleType = 'Vehicle type is required';
    if (!formData.year || parseInt(formData.year) < 1990) errors.year = 'Valid year is required';
    if (!formData.mileage || parseInt(formData.mileage) < 0) errors.mileage = 'Valid mileage is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    addVehicle({
      registration: formData.registration.trim(),
      make: formData.make.trim(),
      model: formData.model.trim(),
      vehicleType: formData.vehicleType.trim(),
      year: parseInt(formData.year),
      color: formData.color.trim(),
      fuelType: formData.fuelType,
      status: 'Available',
      mileage: parseInt(formData.mileage),
      driver: null,
      department: formData.department.trim(),
      lastService: formData.lastService,
      nextService: formData.nextService,
      insuranceExpiry: formData.insuranceExpiry,
      inspectionExpiry: formData.inspectionExpiry,
    });

    setSubmitting(false);
    setAddModal(false);
    setFormData(emptyForm);
    setFormErrors({});

    toast({
      title: 'Vehicle Added',
      description: `${formData.registration} has been registered successfully.`,
    });
  };

  const handleEditVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVehicle || !validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    updateVehicle(editVehicle, {
      registration: formData.registration.trim(),
      make: formData.make.trim(),
      model: formData.model.trim(),
      vehicleType: formData.vehicleType.trim(),
      year: parseInt(formData.year),
      color: formData.color.trim(),
      fuelType: formData.fuelType,
      mileage: parseInt(formData.mileage),
      department: formData.department.trim(),
      lastService: formData.lastService,
      nextService: formData.nextService,
      insuranceExpiry: formData.insuranceExpiry,
      inspectionExpiry: formData.inspectionExpiry,
    });

    setSubmitting(false);
    setEditVehicle(null);
    setFormData(emptyForm);
    setFormErrors({});

    toast({
      title: 'Vehicle Updated',
      description: `${formData.registration} has been updated successfully.`,
    });
  };

  const handleDeleteVehicle = () => {
    if (!deleteConfirm) return;
    deleteVehicle(deleteConfirm);
    toast({
      title: 'Vehicle Deleted',
      description: 'Vehicle has been removed from the fleet.',
    });
    setDeleteConfirm(null);
  };

  const handleSendToMaintenance = () => {
    if (!maintenanceVehicle) return;
    updateVehicleStatus(maintenanceVehicle, 'Maintenance');
    toast({
      title: 'Vehicle Sent to Maintenance',
      description: 'Vehicle status has been updated to Maintenance.',
    });
    setMaintenanceVehicle(null);
  };

  const openEditModal = (vehicleId: string) => {
    const vehicle = (vehicles ?? []).find((v) => v.id === vehicleId);
    if (!vehicle) return;
    setFormData({
      registration: vehicle.registration,
      make: vehicle.make,
      model: vehicle.model,
      vehicleType: vehicle.vehicleType,
      year: vehicle.year.toString(),
      color: vehicle.color,
      fuelType: vehicle.fuelType,
      mileage: vehicle.mileage.toString(),
      department: vehicle.department,
      lastService: vehicle.lastService,
      nextService: vehicle.nextService,
      insuranceExpiry: vehicle.insuranceExpiry,
      inspectionExpiry: vehicle.inspectionExpiry,
    });
    setEditVehicle(vehicleId);
  };

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Vehicles"
        description="Manage vehicle records, availability, mileage and operating status."
        actions={
          <Button onClick={() => { setFormData(emptyForm); setFormErrors({}); setAddModal(true); }}>
            <Plus className="h-4 w-4" />
            Register vehicle
          </Button>
        }
      />

      {summary && (
        <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Card className="px-4 py-3">
            <p className="text-xs text-muted-foreground">Total fleet</p>
            <p className="data-mono mt-1 text-xl font-semibold">{summary.total}</p>
          </Card>
          <Card className="px-4 py-3">
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="data-mono mt-1 text-xl font-semibold text-emerald-700">{summary.available}</p>
          </Card>
          <Card className="px-4 py-3">
            <p className="text-xs text-muted-foreground">Assigned</p>
            <p className="data-mono mt-1 text-xl font-semibold text-sky-700">{summary.assigned}</p>
          </Card>
          <Card className="px-4 py-3">
            <p className="text-xs text-muted-foreground">In service</p>
            <p className="data-mono mt-1 text-xl font-semibold text-amber-700">{summary.inService}</p>
          </Card>
          <Card className="px-4 py-3">
            <p className="text-xs text-muted-foreground">Maintenance</p>
            <p className="data-mono mt-1 text-xl font-semibold text-red-700">{summary.maintenance}</p>
          </Card>
        </div>
      )}

      <Card>
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search registration, make, driver..."
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="sm:max-w-[160px]"
          >
            <option value="">All statuses</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="In service">In service</option>
            <option value="Maintenance">Maintenance</option>
          </Select>
        </div>

        {isLoading ? (
          <TableLoading />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<Truck className="h-5 w-5" />}
            title="No vehicles found"
            description={search || statusFilter ? 'Try adjusting your search or filters.' : 'No vehicles have been registered yet.'}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Insurance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Link href={`/vehicles/${vehicle.id}`} className="data-mono font-semibold text-primary hover:underline">
                        {vehicle.registration}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">{vehicle.make} {vehicle.model}</p>
                      <p className="text-[11px] text-muted-foreground">{vehicle.year} · {vehicle.color}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.vehicleType}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[vehicle.status]} dot>
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="data-mono">{vehicle.mileage.toLocaleString()} km</TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.driver ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.department}</TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.insuranceExpiry}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(vehicle.id)}
                          className="h-7 px-2 text-[11px]"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        {vehicle.status !== 'Maintenance' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setMaintenanceVehicle(vehicle.id)}
                            className="h-7 px-2 text-[11px] text-amber-600 hover:text-amber-600"
                          >
                            <Wrench className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(vehicle.id)}
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

      {/* Add Vehicle Modal */}
      <Modal
        open={addModal}
        onClose={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}
        title="Register New Vehicle"
        description="Add a new vehicle to the fleet"
        footer={
          <>
            <Button variant="outline" onClick={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handleAddVehicle} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Vehicle'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddVehicle} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Registration" required error={formErrors.registration}>
              <Input value={formData.registration} onChange={(e) => setFormData({ ...formData, registration: e.target.value })} placeholder="e.g., UAX 123A" />
            </FormField>
            <FormField label="Vehicle Type" required error={formErrors.vehicleType}>
              <Input value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} placeholder="e.g., Field SUV" />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Make" required error={formErrors.make}>
              <Input value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} placeholder="e.g., Toyota" />
            </FormField>
            <FormField label="Model" required error={formErrors.model}>
              <Input value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="e.g., Land Cruiser" />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Year" required error={formErrors.year}>
              <Input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} placeholder="e.g., 2024" />
            </FormField>
            <FormField label="Color">
              <Input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} placeholder="e.g., White" />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Fuel Type">
              <Select value={formData.fuelType} onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as FuelType })}>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </Select>
            </FormField>
            <FormField label="Mileage (km)" required error={formErrors.mileage}>
              <Input type="number" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} placeholder="e.g., 50000" />
            </FormField>
          </div>
          <FormField label="Department" required error={formErrors.department}>
            <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g., Field Operations" />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Last Service">
              <Input value={formData.lastService} onChange={(e) => setFormData({ ...formData, lastService: e.target.value })} placeholder="e.g., 01 Jan 2024" />
            </FormField>
            <FormField label="Next Service">
              <Input value={formData.nextService} onChange={(e) => setFormData({ ...formData, nextService: e.target.value })} placeholder="e.g., 01 Jul 2024" />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Insurance Expiry">
              <Input value={formData.insuranceExpiry} onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })} placeholder="e.g., 01 Jan 2025" />
            </FormField>
            <FormField label="Inspection Expiry">
              <Input value={formData.inspectionExpiry} onChange={(e) => setFormData({ ...formData, inspectionExpiry: e.target.value })} placeholder="e.g., 01 Jan 2025" />
            </FormField>
          </div>
        </form>
      </Modal>

      {/* Edit Vehicle Modal */}
      <Modal
        open={!!editVehicle}
        onClose={() => { setEditVehicle(null); setFormData(emptyForm); setFormErrors({}); }}
        title={editingVehicle ? `Edit Vehicle — ${editingVehicle.registration}` : ''}
        description="Update vehicle details"
        footer={
          <>
            <Button variant="outline" onClick={() => { setEditVehicle(null); setFormData(emptyForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handleEditVehicle} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditVehicle} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Registration" required error={formErrors.registration}>
              <Input value={formData.registration} onChange={(e) => setFormData({ ...formData, registration: e.target.value })} />
            </FormField>
            <FormField label="Vehicle Type" required error={formErrors.vehicleType}>
              <Input value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Make" required error={formErrors.make}>
              <Input value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} />
            </FormField>
            <FormField label="Model" required error={formErrors.model}>
              <Input value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Year" required error={formErrors.year}>
              <Input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
            </FormField>
            <FormField label="Color">
              <Input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Fuel Type">
              <Select value={formData.fuelType} onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as FuelType })}>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </Select>
            </FormField>
            <FormField label="Mileage (km)" required error={formErrors.mileage}>
              <Input type="number" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Department" required error={formErrors.department}>
            <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Last Service">
              <Input value={formData.lastService} onChange={(e) => setFormData({ ...formData, lastService: e.target.value })} />
            </FormField>
            <FormField label="Next Service">
              <Input value={formData.nextService} onChange={(e) => setFormData({ ...formData, nextService: e.target.value })} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Insurance Expiry">
              <Input value={formData.insuranceExpiry} onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })} />
            </FormField>
            <FormField label="Inspection Expiry">
              <Input value={formData.inspectionExpiry} onChange={(e) => setFormData({ ...formData, inspectionExpiry: e.target.value })} />
            </FormField>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteVehicle}
        title="Delete Vehicle"
        description="Are you sure you want to delete this vehicle? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />

      {/* Send to Maintenance Confirmation */}
      <ConfirmDialog
        open={!!maintenanceVehicle}
        onClose={() => setMaintenanceVehicle(null)}
        onConfirm={handleSendToMaintenance}
        title="Send to Maintenance"
        description="Are you sure you want to send this vehicle for maintenance? The status will be updated to Maintenance."
        confirmLabel="Send to Maintenance"
        variant="default"
      />
    </div>
  );
}
