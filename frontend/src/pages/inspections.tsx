import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/contexts/auth-context';
import { useFleetStore } from '@/stores/fleet-store';
import { useVehicles } from '@/hooks/use-fleet-data';
import { toast } from '@/hooks/use-toast';
import type { InspectionType } from '@/data/types';

export default function Inspections() {
  const { user } = useAuth();
  const { data: vehicles } = useVehicles();
  const addInspection = useFleetStore((s) => s.addInspection);
  const inspections = useFleetStore((s) => s.inspections);

  const [inspectionType, setInspectionType] = useState<InspectionType>('Pre-trip');
  const [vehicleReg, setVehicleReg] = useState('');
  const [mileage, setMileage] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleReg || !mileage) {
      toast({
        title: 'Missing Fields',
        description: 'Please select a vehicle and enter the mileage.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    addInspection({
      vehicle: vehicleReg,
      type: inspectionType,
      result: 'Pending',
      mileage: parseInt(mileage),
      notes,
      submittedBy: user?.name ?? 'Unknown',
    });

    setSubmitting(false);
    setSubmitted(true);

    toast({
      title: 'Inspection Submitted',
      description: `${inspectionType} inspection for ${vehicleReg} has been submitted.`,
    });
  };

  const handleNewInspection = () => {
    setInspectionType('Pre-trip');
    setVehicleReg('');
    setMileage('');
    setNotes('');
    setSubmitted(false);
  };

  const myInspections = inspections.filter(
    (i) => i.submittedBy === user?.name || i.submittedBy.includes(user?.name?.split(' ')[0] ?? ''),
  );

  if (submitted) {
    return (
      <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-lg py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Inspection Submitted</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your {inspectionType} inspection for {vehicleReg} has been submitted successfully.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="outline" onClick={handleNewInspection}>
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
        title="Vehicle Inspections"
        description="Submit and view your vehicle inspection records"
      />

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <section className="border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Submit New Inspection</h3>
          </div>
          <form onSubmit={handleSubmit} className="px-5 py-5">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Inspection Type" required>
                  <Select value={inspectionType} onChange={(e) => setInspectionType(e.target.value as InspectionType)}>
                    <option value="Pre-trip">Pre-trip inspection</option>
                    <option value="Post-trip">Post-trip inspection</option>
                    <option value="Weekly">Weekly inspection</option>
                    <option value="Monthly">Monthly inspection</option>
                  </Select>
                </FormField>
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
              </div>
              <FormField label="Mileage (km)" required>
                <Input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="Enter current mileage"
                />
              </FormField>
              <FormField label="Notes">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any issues or observations..."
                  rows={3}
                />
              </FormField>
              <Button type="submit" className="w-full" disabled={submitting}>
                <CheckCircle2 className="h-4 w-4" />
                {submitting ? 'Submitting...' : 'Submit Inspection'}
              </Button>
            </div>
          </form>
        </section>

        <section className="border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Inspections</h3>
          </div>
          <div className="divide-y divide-border">
            {myInspections.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No inspections submitted yet.
              </div>
            ) : (
              myInspections.slice(0, 5).map((inspection) => (
                <div key={inspection.id} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">{inspection.type} inspection</p>
                    <Badge variant={inspection.result === 'Passed' ? 'success' : inspection.result === 'Failed' ? 'danger' : 'warning'} dot>
                      {inspection.result}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {inspection.vehicle} · {inspection.mileage.toLocaleString()} km · {inspection.date}
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
