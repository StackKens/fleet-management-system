import { useState } from 'react';
import { Plus, UserRound, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { TableLoading } from '@/components/ui/loading-state';
import { Pagination } from '@/components/ui/pagination';
import { Avatar } from '@/components/ui/avatar';
import { useUsers } from '@/hooks/use-fleet-data';
import type { UserRole } from '@/data/types';

const roleVariant: Record<UserRole, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  Admin: 'danger',
  'Fleet Manager': 'primary',
  Driver: 'success',
  Staff: 'default',
  Supervisor: 'warning',
};

export default function Users() {
  const { data: users, isLoading } = useUsers();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
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

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Users"
        description="Workspace users, roles and access controls."
        actions={
          <Button>
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
    </div>
  );
}
