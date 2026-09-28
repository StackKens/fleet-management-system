import { useState } from 'react';
import { Plus, Wrench, Search, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { TableLoading } from '@/components/ui/loading-state';
import { Pagination } from '@/components/ui/pagination';
import { Modal } from '@/components/ui/modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useFleetStore } from '@/stores/fleet-store';
import { useMaintenanceRecords, useVehicles } from '@/hooks/use-fleet-data';
import { toast } from '@/hooks/use-toast';
import type { MaintenanceStatus, MaintenanceType } from '@/data/types';

const statusVariant: Record<MaintenanceStatus, 'warning' | 'info' | 'success' | 'danger'> = {
  Scheduled: 'warning',
  'In progress': 'info',
  Completed: 'success',
  Cancelled: 'danger',
};

const typeVariant: Record<MaintenanceType, 'default' | 'warning' | 'info' | 'danger'> = {
  'Routine service': 'default',
  Repair: 'warning',
  Inspection: 'info',
  Emergency: 'danger',
};

type MaintenanceFormData = {
  vehicle: string;
  type: MaintenanceType;
  description: string;
  scheduledDate: string;
  workshop: string;
  mileageAtService: string;
};

const emptyForm: MaintenanceFormData = {
  vehicle: '',
  type: 'Routine service',
  description: '',
  scheduledDate: '',
  workshop: '',
  mileageAtService: '',
};

export default function Maintenance() {
  const { data: records, isLoading } = useMaintenanceRecords();
  const { data: vehicles } = useVehicles();
  const addMaintenanceRecord = useFleetStore((s) => s.addMaintenanceRecord);
  const updateMaintenanceStatus = useFleetStore((s) => s.updateMaintenanceStatus);
  const deleteMaintenanceRecord = useFleetStore((s) => s.deleteMaintenanceRecord);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [_editRecord, _setEditRecord] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<{ id: string; status: MaintenanceStatus } | null>(null);
  const [formData, setFormData] = useState<MaintenanceFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<MaintenanceFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const perPage = 8;

  const filtered = (records ?? []).filter((r) => {
    const matchesSearch =
      !search ||
      r.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.workshop.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || r.status === statusFilter;
    const matchesType = !typeFilter || r.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const inProgressCount = (records ?? []).filter((r) => r.status === 'In progress').length;
  const scheduledCount = (records ?? []).filter((r) => r.status === 'Scheduled').length;

  const editingRecord = editRecord ? (records ?? []).find((r) => r.id === editRecord) : null;

  const validateForm = (): boolean => {
    const errors: Partial<MaintenanceFormData> = {};
    if (!formData.vehicle) errors.vehicle = 'Vehicle is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.scheduledDate) errors.scheduledDate = 'Scheduled date is required';
    if (!formData.workshop.trim()) errors.workshop = 'Workshop is required';
    if (!formData.mileageAtService || parseInt(formData.mileageAtService) < 0) errors.mileageAtService = 'Valid mileage is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    addMaintenanceRecord({
      vehicle: formData.vehicle,
      type: formData.type,
      status: 'Scheduled',
      description: formData.description.trim(),
      reportedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      scheduledDate: formData.scheduledDate,
      completedDate: null,
      cost: 0,
      partsReplaced: [],
      workshop: formData.workshop.trim(),
      mileageAtService: parseInt(formData.mileageAtService),
    });

    setSubmitting(false);
    setAddModal(false);
    setFormData(emptyForm);
    setFormErrors({});

    toast({
      title: 'Maintenance Booked',
      description: `Maintenance has been booked for ${formData.vehicle}.`,
    });
  };

  const handleUpdateStatus = async () => {
    if (!statusUpdate) return;
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    updateMaintenanceStatus(statusUpdate.id, statusUpdate.status);
    setSubmitting(false);
    toast({
      title: 'Status Updated',
      description: `Maintenance status updated to ${statusUpdate.status}.`,
    });
    setStatusUpdate(null);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    deleteMaintenanceRecord(deleteConfirm);
    toast({
      title: 'Record Deleted',
      description: 'Maintenance record has been deleted.',
    });
    setDeleteConfirm(null);
  };

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Maintenance"
        description="Workshop bookings, service history and vehicle readiness."
        actions={
          <Button onClick={() => { setFormData(emptyForm); setFormErrors({}); setAddModal(true); }}>
            <Plus className="h-4 w-4" />
            Book service
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Total records</p>
          <p className="data-mono mt-1 text-xl font-semibold">{records?.length ?? 0}</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">In progress</p>
          <p className="data-mono mt-1 text-xl font-semibold text-sky-700">{inProgressCount}</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Scheduled</p>
          <p className="data-mono mt-1 text-xl font-semibold text-amber-700">{scheduledCount}</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="data-mono mt-1 text-xl font-semibold text-emerald-700">
            {(records ?? []).filter((r) => r.status === 'Completed').length}
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
              placeholder="Search vehicle, description, workshop..."
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="sm:max-w-[140px]"
          >
            <option value="">All statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In progress">In progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
          <Select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="sm:max-w-[140px]"
          >
            <option value="">All types</option>
            <option value="Routine service">Routine service</option>
            <option value="Repair">Repair</option>
            <option value="Inspection">Inspection</option>
            <option value="Emergency">Emergency</option>
          </Select>
        </div>

        {isLoading ? (
          <TableLoading />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<Wrench className="h-5 w-5" />}
            title="No maintenance records found"
            description={search || statusFilter || typeFilter ? 'Try adjusting your search or filters.' : 'No maintenance records have been created yet.'}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Workshop</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>
                      <Badge variant={typeVariant[record.type]}>
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[250px]">
                      <p className="truncate text-muted-foreground" title={record.description}>
                        {record.description}
                      </p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{record.workshop}</TableCell>
                    <TableCell className="text-muted-foreground">{record.scheduledDate}</TableCell>
                    <TableCell className="data-mono">
                      {record.cost > 0 ? `UGX ${record.cost.toLocaleString()}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[record.status]} dot>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {record.status === 'Scheduled' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setStatusUpdate({ id: record.id, status: 'In progress' })}
                            className="h-7 px-2 text-[11px]"
                          >
                            Start
                          </Button>
                        )}
                        {record.status === 'In progress' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setStatusUpdate({ id: record.id, status: 'Completed' })}
                            className="h-7 px-2 text-[11px] text-emerald-600 hover:text-emerald-600"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(record.id)}
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

      {/* Add Maintenance Record Modal */}
      <Modal
        open={addModal}
        onClose={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}
        title="Book Maintenance Service"
        description="Schedule a new maintenance record"
        footer={
          <>
            <Button variant="outline" onClick={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handleAddRecord} disabled={submitting}>
              {submitting ? 'Booking...' : 'Book Service'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddRecord} className="space-y-4">
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
          <FormField label="Maintenance Type" required>
            <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as MaintenanceType })}>
              <option value="Routine service">Routine service</option>
              <option value="Repair">Repair</option>
              <option value="Inspection">Inspection</option>
              <option value="Emergency">Emergency</option>
            </Select>
          </FormField>
          <FormField label="Description" required error={formErrors.description}>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the maintenance required..."
              rows={3}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Scheduled Date" required error={formErrors.scheduledDate}>
              <Input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </FormField>
            <FormField label="Mileage at Service (km)" required error={formErrors.mileageAtService}>
              <Input
                type="number"
                value={formData.mileageAtService}
                onChange={(e) => setFormData({ ...formData, mileageAtService: e.target.value })}
                placeholder="Current mileage"
              />
            </FormField>
          </div>
          <FormField label="Workshop" required error={formErrors.workshop}>
            <Input
              value={formData.workshop}
              onChange={(e) => setFormData({ ...formData, workshop: e.target.value })}
              placeholder="e.g., Kampala Central Garage"
            />
          </FormField>
        </form>
      </Modal>

      {/* Status Update Confirmation */}
      <ConfirmDialog
        open={!!statusUpdate}
        onClose={() => setStatusUpdate(null)}
        onConfirm={handleUpdateStatus}
        title="Update Maintenance Status"
        description={`Are you sure you want to mark this maintenance as ${statusUpdate?.status}?`}
        confirmLabel="Update Status"
        variant="default"
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Maintenance Record"
        description="Are you sure you want to delete this maintenance record? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
