import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/contexts/auth-context';
import { useFleetStore } from '@/stores/fleet-store';
import { useVehicles, useFuelRecords } from '@/hooks/use-fleet-data';
import { toast } from '@/hooks/use-toast';
import type { FuelType } from '@/data/types';

export default function MyFuel() {
  const { user } = useAuth();
  const { data: vehicles } = useVehicles();
  const { data: fuelRecords } = useFuelRecords();
  const addFuelRecord = useFleetStore((s) => s.addFuelRecord);

  const [vehicleReg, setVehicleReg] = useState('');
  const [liters, setLiters] = useState('');
  const [costPerLiter, setCostPerLiter] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelStation, setFuelStation] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('Diesel');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const myRecords = (fuelRecords ?? []).filter(
    (r) => r.driver === user?.name || r.driver.includes(user?.name?.split(' ')[0] ?? ''),
  );

  const totalCost = liters && costPerLiter ? parseFloat(liters) * parseFloat(costPerLiter) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleReg || !liters || !costPerLiter || !mileage || !fuelStation) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    addFuelRecord({
      vehicle: vehicleReg,
      driver: user?.name ?? 'Unknown',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      liters: parseFloat(liters),
      costPerLiter: parseFloat(costPerLiter),
      totalCost: parseFloat(liters) * parseFloat(costPerLiter),
      mileage: parseInt(mileage),
      fuelStation,
      fuelType,
    });

    setSubmitting(false);
    setSubmitted(true);

    toast({
      title: 'Fuel Record Submitted',
      description: `Fuel record for ${vehicleReg} has been submitted successfully.`,
    });
  };

  const handleNewSubmission = () => {
    setVehicleReg('');
    setLiters('');
    setCostPerLiter('');
    setMileage('');
    setFuelStation('');
    setFuelType('Diesel');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-lg py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Fuel Record Submitted</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your fuel record for {vehicleReg} has been submitted successfully.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="outline" onClick={handleNewSubmission}>
              Submit Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="My Fuel Records"
        description="Submit and view your fuel submissions"
      />

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <section className="border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Submit Fuel Record</h3>
          </div>
          <form onSubmit={handleSubmit} className="px-5 py-5">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Vehicle" required>
                  <Select value={vehicleReg} onChange={(e) => { setVehicleReg(e.target.value); const v = vehicles?.find((veh) => veh.registration === e.target.value); if (v) setMileage(v.mileage.toString()); }}>
                    <option value="">Select vehicle...</option>
                    {(vehicles ?? []).map((v) => (
                      <option key={v.id} value={v.registration}>
                        {v.registration} — {v.make} {v.model}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Fuel Type">
                  <Select value={fuelType} onChange={(e) => setFuelType(e.target.value as FuelType)}>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </Select>
                </FormField>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Liters" required>
                  <Input type="number" step="0.01" value={liters} onChange={(e) => setLiters(e.target.value)} placeholder="0.00" />
                </FormField>
                <FormField label="Cost per Liter (UGX)" required>
                  <Input type="number" value={costPerLiter} onChange={(e) => setCostPerLiter(e.target.value)} placeholder="e.g., 5200" />
                </FormField>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Mileage (km)" required>
                  <Input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} placeholder="Current mileage" />
                </FormField>
                <FormField label="Fuel Station" required>
                  <Input value={fuelStation} onChange={(e) => setFuelStation(e.target.value)} placeholder="e.g., Shell Kampala Road" />
                </FormField>
              </div>
              {totalCost > 0 && (
                <div className="rounded-md border border-border bg-muted/30 px-4 py-3 text-sm">
                  <p className="text-muted-foreground">Total Cost</p>
                  <p className="data-mono mt-1 text-lg font-semibold text-foreground">
                    UGX {totalCost.toLocaleString()}
                  </p>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={submitting}>
                <CheckCircle2 className="h-4 w-4" />
                {submitting ? 'Submitting...' : 'Submit Fuel Record'}
              </Button>
            </div>
          </form>
        </section>

        <section className="border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Submissions</h3>
          </div>
          <div className="divide-y divide-border">
            {myRecords.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No fuel records submitted yet.
              </div>
            ) : (
              myRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">{record.fuelStation}</p>
                    <Badge variant="success" dot>Submitted</Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {record.liters}L · UGX {record.totalCost.toLocaleString()} · {record.date}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
