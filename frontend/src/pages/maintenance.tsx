import { useState } from 'react';
import { Link } from 'wouter';
import { Plus, Wrench, Search } from 'lucide-react';
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
import { useMaintenanceRecords } from '@/hooks/use-fleet-data';
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

export default function Maintenance() {
  const { data: records, isLoading } = useMaintenanceRecords();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
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

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Maintenance"
        description="Workshop bookings, service history and vehicle readiness."
        actions={
          <Button>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <span className="data-mono font-semibold text-foreground">{record.id}</span>
                    </TableCell>
                    <TableCell>
                      <Link href={`/vehicles`} className="data-mono font-medium text-primary hover:underline">
                        {record.vehicle}
                      </Link>
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
