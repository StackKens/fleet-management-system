import { useState } from 'react';
import { Link } from 'wouter';
import { Plus, Truck, Search } from 'lucide-react';
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
import { useVehicles, useVehicleSummary } from '@/hooks/use-fleet-data';
import type { VehicleStatus } from '@/data/types';

const statusVariant: Record<VehicleStatus, 'success' | 'info' | 'warning' | 'danger'> = {
  Available: 'success',
  Assigned: 'info',
  'In service': 'warning',
  Maintenance: 'danger',
};

export default function Vehicles() {
  const { data: vehicles, isLoading } = useVehicles();
  const { data: summary } = useVehicleSummary();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = (vehicles ?? []).filter((v) => {
    const matchesSearch =
      !search ||
      v.registration.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.driver?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Vehicles"
        description="Manage vehicle records, availability, mileage and operating status."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Register vehicle
          </Button>
        }
      />

      {summary && (
        <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Card className="px-4 py-3">
            <p className="text-xs text-muted-foreground">Total fleet</p>
            <p className="data-mono mt-1 text-xl font-semibold">{summary.total}</p>
          </Card>
          <Card className="px-4 py-3">
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="data-mono mt-1 text-xl font-semibold text-emerald-700">{summary.available}</p>
          </Card>
          <Card className="px-4 py-3">
            <p className="text-xs text-muted-foreground">Assigned</p>
            <p className="data-mono mt-1 text-xl font-semibold text-sky-700">{summary.assigned}</p>
          </Card>
          <Card className="px-4 py-3">
            <p className="text-xs text-muted-foreground">In service</p>
            <p className="data-mono mt-1 text-xl font-semibold text-amber-700">{summary.inService}</p>
          </Card>
          <Card className="px-4 py-3">
            <p className="text-xs text-muted-foreground">Maintenance</p>
            <p className="data-mono mt-1 text-xl font-semibold text-red-700">{summary.maintenance}</p>
          </Card>
        </div>
      )}

      <Card>
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search registration, make, driver..."
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="sm:max-w-[160px]"
          >
            <option value="">All statuses</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="In service">In service</option>
            <option value="Maintenance">Maintenance</option>
          </Select>
        </div>

        {isLoading ? (
          <TableLoading />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<Truck className="h-5 w-5" />}
            title="No vehicles found"
            description={search || statusFilter ? 'Try adjusting your search or filters.' : 'No vehicles have been registered yet.'}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Insurance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Link href={`/vehicles/${vehicle.id}`} className="data-mono font-semibold text-primary hover:underline">
                        {vehicle.registration}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">{vehicle.make} {vehicle.model}</p>
                      <p className="text-[11px] text-muted-foreground">{vehicle.year} · {vehicle.color}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.vehicleType}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[vehicle.status]} dot>
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="data-mono">{vehicle.mileage.toLocaleString()} km</TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.driver ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.department}</TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.insuranceExpiry}</TableCell>
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
