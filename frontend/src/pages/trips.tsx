import { useState } from 'react';
import { Plus, Activity, Search } from 'lucide-react';
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
import { useTrips } from '@/hooks/use-fleet-data';
import type { TripStatus } from '@/data/types';

const statusVariant: Record<TripStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  Scheduled: 'warning',
  'On route': 'info',
  Returned: 'success',
  Cancelled: 'danger',
};

export default function Trips() {
  const { data: trips, isLoading } = useTrips();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = (trips ?? []).filter((t) => {
    const matchesSearch =
      !search ||
      t.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      t.driver.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const activeCount = (trips ?? []).filter((t) => t.status === 'On route').length;

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Trips"
        description="Trip scheduling, dispatch status and return tracking."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Schedule trip
          </Button>
        }
      />

      {activeCount > 0 && (
        <div className="mb-6 border border-sky-200 bg-sky-50 px-5 py-3 text-xs text-sky-800">
          <span className="font-semibold">{activeCount} trip{activeCount > 1 ? 's' : ''}</span> currently on route
        </div>
      )}

      <Card>
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search vehicle, driver, destination..."
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="sm:max-w-[160px]"
          >
            <option value="">All statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="On route">On route</option>
            <option value="Returned">Returned</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </div>

        {isLoading ? (
          <TableLoading />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<Activity className="h-5 w-5" />}
            title="No trips found"
            description={search || statusFilter ? 'Try adjusting your search or filters.' : 'No trips have been scheduled yet.'}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip</TableHead>
                  <TableHead>Vehicle / Driver</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Expected return</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <span className="data-mono font-semibold text-foreground">{trip.id}</span>
                    </TableCell>
                    <TableCell>
                      <p className="data-mono font-medium text-foreground">{trip.vehicle}</p>
                      <p className="text-[11px] text-muted-foreground">{trip.driver}</p>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{trip.destination}</TableCell>
                    <TableCell className="text-muted-foreground">{trip.departure}</TableCell>
                    <TableCell className="text-muted-foreground">{trip.expectedReturn}</TableCell>
                    <TableCell className="data-mono">
                      {trip.mileageEnd
                        ? `${(trip.mileageEnd - trip.mileageStart).toLocaleString()} km`
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[trip.status]} dot>
                        {trip.status}
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
