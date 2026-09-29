import { useState } from 'react';
import { Plus, UserRound, Search, Edit, Trash2 } from 'lucide-react';
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
import { useUsers, useDepartments } from '@/hooks/use-fleet-data';
import { toast } from '@/hooks/use-toast';
import type { UserRole } from '@/data/types';

const roleVariant: Record<UserRole, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  Admin: 'danger',
  'Fleet Manager': 'primary',
  Driver: 'success',
  Staff: 'default',
  Supervisor: 'warning',
};

type UserFormData = {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  phone: string;
};

const emptyForm: UserFormData = {
  name: '',
  email: '',
  role: 'Staff',
  department: '',
  phone: '',
};

export default function Users() {
  const { data: users, isLoading } = useUsers();
  const { data: departments } = useDepartments();
  const addUser = useFleetStore((s) => s.addDriver);
  const updateUser = useFleetStore((s) => s.updateDriver);
  const deleteUser = useFleetStore((s) => s.deleteDriver);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [editUser, setEditUser] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const perPage = 8;

  const filtered = (users ?? []).filter((u) => {
    const matchesSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    const matchesStatus = !statusFilter || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const editingUser = editUser ? (users ?? []).find((u) => u.id === editUser) : null;

  const validateForm = (): boolean => {
    const errors: Partial<UserFormData> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    addUser({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      licenseNumber: 'N/A',
      licenseExpiry: 'N/A',
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
      title: 'User Added',
      description: `${formData.name} has been added successfully.`,
    });
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser || !validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    updateUser(editUser, {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
    });

    setSubmitting(false);
    setEditUser(null);
    setFormData(emptyForm);
    setFormErrors({});

    toast({
      title: 'User Updated',
      description: `${formData.name} has been updated successfully.`,
    });
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    deleteUser(deleteConfirm);
    toast({
      title: 'User Deleted',
      description: 'User has been removed from the system.',
    });
    setDeleteConfirm(null);
  };

  const openEditModal = (userId: string) => {
    const user = (users ?? []).find((u) => u.id === userId);
    if (!user) return;
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
    });
    setEditUser(userId);
  };

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Users"
        description="Workspace users, roles and access controls."
        actions={
          <Button onClick={() => { setFormData(emptyForm); setFormErrors({}); setAddModal(true); }}>
            <Plus className="h-4 w-4" />
            Add user
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
              placeholder="Search name, email, department..."
              className="pl-9"
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="sm:max-w-[160px]"
          >
            <option value="">All roles</option>
            <option value="Admin">Admin</option>
            <option value="Fleet Manager">Fleet Manager</option>
            <option value="Driver">Driver</option>
            <option value="Staff">Staff</option>
            <option value="Supervisor">Supervisor</option>
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="sm:max-w-[140px]"
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </div>

        {isLoading ? (
          <TableLoading />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<UserRound className="h-5 w-5" />}
            title="No users found"
            description={search || roleFilter || statusFilter ? 'Try adjusting your search or filters.' : 'No users have been added yet.'}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <div>
                          <p className="font-semibold text-foreground">{user.name}</p>
                          <p className="text-[11px] text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[user.role] ?? 'default'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.department}</TableCell>
                    <TableCell className="text-muted-foreground">{user.phone}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Active' ? 'success' : 'default'} dot>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(user.id)}
                          className="h-7 px-2 text-[11px]"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(user.id)}
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

      {/* Add User Modal */}
      <Modal
        open={addModal}
        onClose={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}
        title="Add New User"
        description="Create a new user account"
        footer={
          <>
            <Button variant="outline" onClick={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add User'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <FormField label="Full Name" required error={formErrors.name}>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Jane Doe" />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Email" required error={formErrors.email}>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="e.g., jane@fleet.ug" />
            </FormField>
            <FormField label="Phone" required error={formErrors.phone}>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="e.g., +256 772 123 456" />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Role" required>
              <Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}>
                <option value="Staff">Staff</option>
                <option value="Driver">Driver</option>
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Admin">Admin</option>
              </Select>
            </FormField>
            <FormField label="Department" required error={formErrors.department}>
              <Select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                <option value="">Select department...</option>
                {(departments ?? []).map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        open={!!editUser}
        onClose={() => { setEditUser(null); setFormData(emptyForm); setFormErrors({}); }}
        title={editingUser ? `Edit User — ${editingUser.name}` : ''}
        description="Update user details"
        footer={
          <>
            <Button variant="outline" onClick={() => { setEditUser(null); setFormData(emptyForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditUser} className="space-y-4">
          <FormField label="Full Name" required error={formErrors.name}>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Email" required error={formErrors.email}>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </FormField>
            <FormField label="Phone" required error={formErrors.phone}>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Role" required>
              <Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}>
                <option value="Staff">Staff</option>
                <option value="Driver">Driver</option>
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Admin">Admin</option>
              </Select>
            </FormField>
            <FormField label="Department" required error={formErrors.department}>
              <Select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                <option value="">Select department...</option>
                {(departments ?? []).map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
