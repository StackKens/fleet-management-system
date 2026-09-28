import { useState } from 'react';
import { Link } from 'wouter';
import { Plus, CarFront, Search, XCircle, Eye } from 'lucide-react';
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
import { useFleetStore } from '@/stores/fleet-store';
import { useAssignments, useVehicles, useDrivers } from '@/hooks/use-fleet-data';
import { assignmentStatusVariant } from '@/data/status-variants';
import { toast } from '@/hooks/use-toast';
import type { Assignment } from '@/data/types';

type AssignmentFormData = {
  vehicle: string;
  driver: string;
  department: string;
  purpose: string;
  startDate: string;
};

const emptyForm: AssignmentFormData = {
  vehicle: '',
  driver: '',
  department: '',
  purpose: '',
  startDate: '',
};

export default function Assignments() {
  const { data: assignments, isLoading } = useAssignments();
  const { data: vehicles } = useVehicles();
  const { data: drivers } = useDrivers();
  const addAssignment = useFleetStore((s) => s.addAssignment);
  const updateAssignmentStatus = useFleetStore((s) => s.updateAssignmentStatus);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState<AssignmentFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<AssignmentFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const perPage = 8;

  const filtered = (assignments ?? []).filter((a) => {
    const matchesSearch =
      !search ||
      a.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      a.driver.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase()) ||
      a.purpose.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const activeCount = (assignments ?? []).filter((a) => a.status === 'Active').length;

  const availableVehicles = (vehicles ?? []).filter((v) => v.status === 'Available');
  const availableDrivers = (drivers ?? []).filter((d) => d.status === 'Active' && !d.assignedVehicle);

  const validateForm = (): boolean => {
    const errors: Partial<AssignmentFormData> = {};
    if (!formData.vehicle) errors.vehicle = 'Vehicle is required';
    if (!formData.driver) errors.driver = 'Driver is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    if (!formData.purpose.trim()) errors.purpose = 'Purpose is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    addAssignment({
      vehicle: formData.vehicle,
      driver: formData.driver,
      department: formData.department.trim(),
      startDate: formData.startDate,
      endDate: null,
      status: 'Active',
      purpose: formData.purpose.trim(),
    });

    // Update vehicle status
    const vehicle = vehicles?.find((v) => v.registration === formData.vehicle);
    if (vehicle) {
      useFleetStore.getState().updateVehicle(vehicle.id, { status: 'Assigned', driver: formData.driver });
    }

    setSubmitting(false);
    setAddModal(false);
    setFormData(emptyForm);
    setFormErrors({});

    toast({
      title: 'Assignment Created',
      description: `${formData.vehicle} assigned to ${formData.driver}.`,
    });
  };

  const handleCancelAssignment = () => {
    if (!cancelConfirm) return;
    updateAssignmentStatus(cancelConfirm.id, 'Cancelled');

    // Make vehicle available again
    const vehicle = vehicles?.find((v) => v.registration === cancelConfirm.vehicle);
    if (vehicle) {
      useFleetStore.getState().updateVehicle(vehicle.id, { status: 'Available', driver: null });
    }

    toast({
      title: 'Assignment Cancelled',
      description: `Assignment for ${cancelConfirm.vehicle} has been cancelled.`,
    });
    setCancelConfirm(null);
  };

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Assignments"
        description="Vehicle and driver allocation for approved requests."
        actions={
          <Button onClick={() => { setFormData(emptyForm); setFormErrors({}); setAddModal(true); }}>
            <Plus className="h-4 w-4" />
            New assignment
          </Button>
        }
      />

      {activeCount > 0 && (
        <div className="mb-6 border border-sky-200 bg-sky-50 px-5 py-3 text-xs text-sky-800">
          <span className="font-semibold">{activeCount} active assignment{activeCount > 1 ? 's' : ''}</span> currently in operation
        </div>
      )}

      <Card>
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search vehicle, driver, purpose..."
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
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </div>

        {isLoading ? (
          <TableLoading />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<CarFront className="h-5 w-5" />}
            title="No assignments found"
            description={search || statusFilter ? 'Try adjusting your search or filters.' : 'No assignments have been created yet.'}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Start date</TableHead>
                  <TableHead>End date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <Link href={`/vehicles`} className="data-mono font-semibold text-primary hover:underline">
                        {assignment.vehicle}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{assignment.driver}</TableCell>
                    <TableCell className="text-muted-foreground">{assignment.department}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{assignment.purpose}</TableCell>
                    <TableCell className="text-muted-foreground">{assignment.startDate}</TableCell>
                    <TableCell className="text-muted-foreground">{assignment.endDate ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={assignmentStatusVariant[assignment.status] ?? 'default'} dot>
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedAssignment(assignment)}
                          className="h-7 px-2 text-[11px]"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {assignment.status === 'Active' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setCancelConfirm(assignment)}
                            className="h-7 px-2 text-[11px] text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        )}
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

      {/* New Assignment Modal */}
      <Modal
        open={addModal}
        onClose={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}
        title="New Assignment"
        description="Assign a vehicle and driver"
        footer={
          <>
            <Button variant="outline" onClick={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handleAddAssignment} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Assignment'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddAssignment} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <FormField label="Department" required error={formErrors.department}>
            <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g., Field Operations" />
          </FormField>
          <FormField label="Purpose" required error={formErrors.purpose}>
            <Input value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} placeholder="Assignment purpose" />
          </FormField>
          <FormField label="Start Date" required error={formErrors.startDate}>
            <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
          </FormField>
        </form>
      </Modal>

      {/* View Assignment Modal */}
      <Modal
        open={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        title={selectedAssignment ? `Assignment ${selectedAssignment.id}` : ''}
        description={selectedAssignment ? `${selectedAssignment.vehicle} — ${selectedAssignment.driver}` : undefined}
        footer={
          <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
            Close
          </Button>
        }
      >
        {selectedAssignment && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="data-mono mt-1 font-medium text-foreground">{selectedAssignment.vehicle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Driver</p>
                <p className="mt-1 font-medium text-foreground">{selectedAssignment.driver}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="mt-1 font-medium text-foreground">{selectedAssignment.department}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Purpose</p>
                <p className="mt-1 font-medium text-foreground">{selectedAssignment.purpose}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="mt-1 font-medium text-foreground">{selectedAssignment.startDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="mt-1 font-medium text-foreground">{selectedAssignment.endDate ?? '—'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        open={!!cancelConfirm}
        onClose={() => setCancelConfirm(null)}
        title="Cancel Assignment"
        description={cancelConfirm ? `Are you sure you want to cancel the assignment of ${cancelConfirm.vehicle} to ${cancelConfirm.driver}?` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => setCancelConfirm(null)}>
              Keep Assignment
            </Button>
            <Button variant="destructive" onClick={handleCancelAssignment}>
              Yes, Cancel Assignment
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          The vehicle will be made available for other assignments.
        </p>
      </Modal>
    </div>
  );
}
