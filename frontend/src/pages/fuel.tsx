import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { TableLoading } from '@/components/ui/loading-state';
import { Pagination } from '@/components/ui/pagination';
import { useFuelRecords } from '@/hooks/use-fleet-data';

export default function Fuel() {
  const { data: records, isLoading } = useFuelRecords();
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const vehicleOptions = [...new Set((records ?? []).map((r) => r.vehicle))];

  const filtered = (records ?? []).filter((r) => {
    const matchesSearch =
      !search ||
      r.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      r.driver.toLowerCase().includes(search.toLowerCase()) ||
      r.fuelStation.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchesVehicle = !vehicleFilter || r.vehicle === vehicleFilter;
    return matchesSearch && matchesVehicle;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const totalLiters = filtered.reduce((sum, r) => sum + r.liters, 0);
  const totalCost = filtered.reduce((sum, r) => sum + r.totalCost, 0);

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Fuel"
        description="Fuel issues, consumption records and cost controls."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Add fuel record
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Total records</p>
          <p className="data-mono mt-1 text-xl font-semibold">{filtered.length}</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Total liters</p>
          <p className="data-mono mt-1 text-xl font-semibold">{totalLiters.toLocaleString()} L</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Total cost</p>
          <p className="data-mono mt-1 text-xl font-semibold">UGX {(totalCost / 1000000).toFixed(1)}M</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Avg cost/L</p>
          <p className="data-mono mt-1 text-xl font-semibold">
            UGX {totalLiters > 0 ? Math.round(totalCost / totalLiters).toLocaleString() : 0}
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
              placeholder="Search vehicle, driver, station..."
              className="pl-9"
            />
          </div>
          <Select
            value={vehicleFilter}
            onChange={(e) => { setVehicleFilter(e.target.value); setPage(1); }}
            className="sm:max-w-[160px]"
          >
            <option value="">All vehicles</option>
            {vehicleOptions.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </Select>
        </div>

        {isLoading ? (
          <TableLoading />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<Fuel className="h-5 w-5" />}
            title="No fuel records found"
            description={search || vehicleFilter ? 'Try adjusting your search or filters.' : 'No fuel records have been added yet.'}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Liters</TableHead>
                  <TableHead>Cost/L</TableHead>
                  <TableHead>Total cost</TableHead>
                  <TableHead>Station</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <span className="data-mono font-semibold text-foreground">{record.id}</span>
                    </TableCell>
                    <TableCell>
                      <span className="data-mono font-medium text-primary">
                        {record.vehicle}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{record.driver}</TableCell>
                    <TableCell className="text-muted-foreground">{record.date}</TableCell>
                    <TableCell className="data-mono">{record.liters} L</TableCell>
                    <TableCell className="data-mono">UGX {record.costPerLiter.toLocaleString()}</TableCell>
                    <TableCell className="data-mono font-semibold text-foreground">
                      UGX {record.totalCost.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{record.fuelStation}</TableCell>
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
