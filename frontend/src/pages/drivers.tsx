import { useState } from 'react';
import { Link } from 'wouter';
import { Plus, UsersRound, Search } from 'lucide-react';
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
import { useDrivers } from '@/hooks/use-fleet-data';
import type { DriverStatus } from '@/data/types';

const statusVariant: Record<DriverStatus, 'success' | 'warning' | 'danger' | 'default'> = {
  Active: 'success',
  'On leave': 'warning',
  Suspended: 'danger',
  Inactive: 'default',
};

export default function Drivers() {
  const { data: drivers, isLoading } = useDrivers();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
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

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Drivers"
        description="Driver profiles, licensing, assignments and performance."
        actions={
          <Button>
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
