import { useState } from 'react';
import { Link } from 'wouter';
import { Plus, CarFront, Search } from 'lucide-react';
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
import { useAssignments } from '@/hooks/use-fleet-data';

const statusVariant: Record<string, 'success' | 'default' | 'danger'> = {
  Active: 'success',
  Completed: 'default',
  Cancelled: 'danger',
};

export default function Assignments() {
  const { data: assignments, isLoading } = useAssignments();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
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

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Assignments"
        description="Vehicle and driver allocation for approved requests."
        actions={
          <Button>
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
                      <Badge variant={statusVariant[assignment.status] ?? 'default'} dot>
                        {assignment.status}
                      </Badge>
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
    </div>
  );
}
