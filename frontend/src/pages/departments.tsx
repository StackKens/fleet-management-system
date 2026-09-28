import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDepartments } from '@/hooks/use-fleet-data';

export default function Departments() {
  const { data: departments } = useDepartments();

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <section className="mb-7 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Admin Workspace</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Departments</h2>
          <p className="mt-2 text-sm text-muted-foreground">Manage organizational departments</p>
        </div>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          Add Department
        </Button>
      </section>

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
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
