import { useState } from 'react';
import { Link } from 'wouter';
import { Plus, UsersRound, Search, Edit, Trash2 } from 'lucide-react';
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
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useFleetStore } from '@/stores/fleet-store';
import { useDrivers } from '@/hooks/use-fleet-data';
import { toast } from '@/hooks/use-toast';
import type { DriverStatus } from '@/data/types';

const statusVariant: Record<DriverStatus, 'success' | 'warning' | 'danger' | 'default'> = {
  Active: 'success',
  'On leave': 'warning',
  Suspended: 'danger',
  Inactive: 'default',
};

type DriverFormData = {
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  department: string;
};

const emptyForm: DriverFormData = {
  name: '',
  phone: '',
  email: '',
  licenseNumber: '',
  licenseExpiry: '',
  department: '',
};

export default function Drivers() {
  const { data: drivers, isLoading } = useDrivers();
  const addDriver = useFleetStore((s) => s.addDriver);
  const updateDriver = useFleetStore((s) => s.updateDriver);
  const deleteDriver = useFleetStore((s) => s.deleteDriver);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [editDriver, setEditDriver] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<DriverFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<DriverFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const perPage = 8;

  const filtered = (drivers ?? []).filter((d) => {
    const matchesSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const editingDriver = editDriver ? (drivers ?? []).find((d) => d.id === editDriver) : null;

  const validateForm = (): boolean => {
    const errors: Partial<DriverFormData> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.licenseNumber.trim()) errors.licenseNumber = 'License number is required';
    if (!formData.licenseExpiry) errors.licenseExpiry = 'License expiry is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    addDriver({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      licenseNumber: formData.licenseNumber.trim(),
      licenseExpiry: formData.licenseExpiry,
      status: 'Active',
      department: formData.department.trim(),
      assignedVehicle: null,
      tripsCompleted: 0,
      rating: 5.0,
      joinDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    });

    setSubmitting(false);
    setAddModal(false);
    setFormData(emptyForm);
    setFormErrors({});

    toast({
      title: 'Driver Added',
      description: `${formData.name} has been added successfully.`,
    });
  };

  const handleEditDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDriver || !validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    updateDriver(editDriver, {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      licenseNumber: formData.licenseNumber.trim(),
      licenseExpiry: formData.licenseExpiry,
      department: formData.department.trim(),
    });

    setSubmitting(false);
    setEditDriver(null);
    setFormData(emptyForm);
    setFormErrors({});

    toast({
      title: 'Driver Updated',
      description: `${formData.name} has been updated successfully.`,
    });
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    deleteDriver(deleteConfirm);
    toast({
      title: 'Driver Deleted',
      description: 'Driver has been removed from the system.',
    });
    setDeleteConfirm(null);
  };

  const openEditModal = (driverId: string) => {
    const driver = (drivers ?? []).find((d) => d.id === driverId);
    if (!driver) return;
    setFormData({
      name: driver.name,
      phone: driver.phone,
      email: driver.email,
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry,
      department: driver.department,
    });
    setEditDriver(driverId);
  };

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Drivers"
        description="Driver profiles, licensing, assignments and performance."
        actions={
          <Button onClick={() => { setFormData(emptyForm); setFormErrors({}); setAddModal(true); }}>
            <Plus className="h-4 w-4" />
            Add driver
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name, license, department..."
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="sm:max-w-[160px]"
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="On leave">On leave</option>
            <option value="Suspended">Suspended</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </div>

        {isLoading ? (
          <TableLoading />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<UsersRound className="h-5 w-5" />}
            title="No drivers found"
            description={search || statusFilter ? 'Try adjusting your search or filters.' : 'No drivers have been added yet.'}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Assigned vehicle</TableHead>
                  <TableHead>Trips</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>License expiry</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={driver.name} size="sm" />
                        <div>
                          <Link href={`/drivers/${driver.id}`} className="font-semibold text-primary hover:underline">
                            {driver.name}
                          </Link>
                          <p className="text-[11px] text-muted-foreground">{driver.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="data-mono text-muted-foreground">{driver.licenseNumber}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[driver.status]} dot>
                        {driver.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{driver.department}</TableCell>
                    <TableCell className="data-mono">{driver.assignedVehicle ?? '—'}</TableCell>
                    <TableCell className="data-mono">{driver.tripsCompleted}</TableCell>
                    <TableCell>
                      <span className="data-mono font-semibold text-foreground">{driver.rating}</span>
                      <span className="text-[11px] text-muted-foreground"> / 5</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{driver.licenseExpiry}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(driver.id)}
                          className="h-7 px-2 text-[11px]"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(driver.id)}
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

      {/* Add Driver Modal */}
      <Modal
        open={addModal}
        onClose={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}
        title="Add New Driver"
        description="Register a new driver in the system"
        footer={
          <>
            <Button variant="outline" onClick={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handleAddDriver} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Driver'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddDriver} className="space-y-4">
          <FormField label="Full Name" required error={formErrors.name}>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., John Doe" />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Phone" required error={formErrors.phone}>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="e.g., +256 772 123 456" />
            </FormField>
            <FormField label="Email" required error={formErrors.email}>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="e.g., john@fleet.ug" />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="License Number" required error={formErrors.licenseNumber}>
              <Input value={formData.licenseNumber} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} placeholder={`e.g., DL-${new Date().getFullYear()}-123456`} />
            </FormField>
            <FormField label="License Expiry" required error={formErrors.licenseExpiry}>
              <Input type="date" value={formData.licenseExpiry} onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Department" required error={formErrors.department}>
            <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g., Field Operations" />
          </FormField>
        </form>
      </Modal>

      {/* Edit Driver Modal */}
      <Modal
        open={!!editDriver}
        onClose={() => { setEditDriver(null); setFormData(emptyForm); setFormErrors({}); }}
        title={editingDriver ? `Edit Driver — ${editingDriver.name}` : ''}
        description="Update driver details"
        footer={
          <>
            <Button variant="outline" onClick={() => { setEditDriver(null); setFormData(emptyForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handleEditDriver} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditDriver} className="space-y-4">
          <FormField label="Full Name" required error={formErrors.name}>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Phone" required error={formErrors.phone}>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </FormField>
            <FormField label="Email" required error={formErrors.email}>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="License Number" required error={formErrors.licenseNumber}>
              <Input value={formData.licenseNumber} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} />
            </FormField>
            <FormField label="License Expiry" required error={formErrors.licenseExpiry}>
              <Input type="date" value={formData.licenseExpiry} onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Department" required error={formErrors.department}>
            <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
          </FormField>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Driver"
        description="Are you sure you want to delete this driver? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
