import { useState } from 'react';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { Modal } from '@/components/ui/modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useFleetStore } from '@/stores/fleet-store';
import { useDepartments } from '@/hooks/use-fleet-data';
import { toast } from '@/hooks/use-toast';
import type { Department } from '@/data/types';

type DepartmentFormData = {
  name: string;
  head: string;
};

const emptyForm: DepartmentFormData = {
  name: '',
  head: '',
};

export default function Departments() {
  const { data: departments } = useDepartments();
  const addNotification = useFleetStore((s) => s.addNotification);

  const [addModal, setAddModal] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Department | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<DepartmentFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const errors: Partial<DepartmentFormData> = {};
    if (!formData.name.trim()) errors.name = 'Department name is required';
    if (!formData.head.trim()) errors.head = 'Department head is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newDept: Department = {
      id: `DEP-${String((departments?.length ?? 0) + 1).padStart(3, '0')}`,
      name: formData.name.trim(),
      head: formData.head.trim(),
      vehicleCount: 0,
      driverCount: 0,
    };

    useFleetStore.setState((state) => ({
      departments: [...(state.departments ?? []), newDept],
    }));

    addNotification({
      type: 'system',
      title: 'Department Added',
      message: `${formData.name} has been added to the organization.`,
      link: '/departments',
    });

    setSubmitting(false);
    setAddModal(false);
    setFormData(emptyForm);
    setFormErrors({});

    toast({
      title: 'Department Added',
      description: `${formData.name} has been added successfully.`,
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDept || !validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    useFleetStore.setState((state) => ({
      departments: (state.departments ?? []).map((d) =>
        d.id === editDept.id ? { ...d, name: formData.name.trim(), head: formData.head.trim() } : d,
      ),
    }));

    addNotification({
      type: 'system',
      title: 'Department Updated',
      message: `${formData.name} has been updated.`,
      link: '/departments',
    });

    setSubmitting(false);
    setEditDept(null);
    setFormData(emptyForm);
    setFormErrors({});

    toast({
      title: 'Department Updated',
      description: `${formData.name} has been updated successfully.`,
    });
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;

    useFleetStore.setState((state) => ({
      departments: (state.departments ?? []).filter((d) => d.id !== deleteConfirm.id),
    }));

    addNotification({
      type: 'system',
      title: 'Department Removed',
      message: `${deleteConfirm.name} has been removed from the organization.`,
      link: '/departments',
    });

    toast({
      title: 'Department Deleted',
      description: `${deleteConfirm.name} has been deleted.`,
    });
    setDeleteConfirm(null);
  };

  const openEditModal = (dept: Department) => {
    setFormData({ name: dept.name, head: dept.head });
    setEditDept(dept);
  };

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Departments"
        description="Manage organizational departments"
        actions={
          <Button onClick={() => { setFormData(emptyForm); setFormErrors({}); setAddModal(true); }}>
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        }
      />

      <section className="border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">All Departments</h3>
          <span className="text-xs text-muted-foreground">{departments?.length ?? 0} departments</span>
        </div>
        <div className="divide-y divide-border">
          {departments?.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
              <p className="mt-4 text-sm text-muted-foreground">No departments configured.</p>
            </div>
          ) : (
            departments?.map((dept) => (
              <div key={dept.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
                    <Building2 className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{dept.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Head: {dept.head}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default">{dept.vehicleCount} vehicles</Badge>
                  <Badge variant="default">{dept.driverCount} drivers</Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(dept)}
                      className="h-7 px-2 text-[11px]"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteConfirm(dept)}
                      className="h-7 px-2 text-[11px] text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Add Department Modal */}
      <Modal
        open={addModal}
        onClose={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}
        title="Add New Department"
        description="Create a new organizational department"
        footer={
          <>
            <Button variant="outline" onClick={() => { setAddModal(false); setFormData(emptyForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Department'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <FormField label="Department Name" required error={formErrors.name}>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Public Health"
            />
          </FormField>
          <FormField label="Department Head" required error={formErrors.head}>
            <Input
              value={formData.head}
              onChange={(e) => setFormData({ ...formData, head: e.target.value })}
              placeholder="e.g., Dr. Grace Namusoke"
            />
          </FormField>
        </form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        open={!!editDept}
        onClose={() => { setEditDept(null); setFormData(emptyForm); setFormErrors({}); }}
        title={editDept ? `Edit Department — ${editDept.name}` : ''}
        description="Update department details"
        footer={
          <>
            <Button variant="outline" onClick={() => { setEditDept(null); setFormData(emptyForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <FormField label="Department Name" required error={formErrors.name}>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>
          <FormField label="Department Head" required error={formErrors.head}>
            <Input
              value={formData.head}
              onChange={(e) => setFormData({ ...formData, head: e.target.value })}
            />
          </FormField>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        description={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
