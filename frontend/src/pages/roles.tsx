import { UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ROLE_CAPABILITIES } from '@/data/capabilities';
import type { UserRole } from '@/data/types';

const roles: { role: UserRole; description: string; userCount: number }[] = [
  { role: 'Admin', description: 'Full system access and configuration', userCount: 1 },
  { role: 'Fleet Manager', description: 'Manage fleet operations, vehicles, and drivers', userCount: 1 },
  { role: 'Driver', description: 'View assigned vehicle and trips, submit reports', userCount: 1 },
  { role: 'Staff', description: 'Request and track transportation', userCount: 1 },
  { role: 'Supervisor', description: 'Supervise fleet operations and assignments', userCount: 1 },
];

export default function Roles() {
  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <section className="mb-7 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Admin Workspace</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Roles & Permissions</h2>
        <p className="mt-2 text-sm text-muted-foreground">Manage roles and their associated permissions</p>
      </section>

      <section className="border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">System Roles</h3>
          <span className="text-xs text-muted-foreground">{roles.length} roles</span>
        </div>
        <div className="divide-y divide-border">
          {roles.map((role) => (
            <div key={role.role} className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
                    <UserCog className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{role.role}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default">{role.userCount} user{role.userCount !== 1 ? 's' : ''}</Badge>
                  <Badge variant="info">{ROLE_CAPABILITIES[role.role]?.length ?? 0} permissions</Badge>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ROLE_CAPABILITIES[role.role]?.slice(0, 5).map((cap) => (
                  <span key={cap} className="rounded-full border border-border bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground">
                    {cap}
                  </span>
                ))}
                {(ROLE_CAPABILITIES[role.role]?.length ?? 0) > 5 && (
                  <span className="rounded-full border border-border bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground">
                    +{(ROLE_CAPABILITIES[role.role]?.length ?? 0) - 5} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
