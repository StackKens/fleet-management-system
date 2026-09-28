import { useState } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { useAuth } from '@/contexts/auth-context';
import { useFleetStore } from '@/stores/fleet-store';
import { toast } from '@/hooks/use-toast';

type FormErrors = {
  destination?: string;
  purpose?: string;
  startDate?: string;
  endDate?: string;
  passengers?: string;
};

export default function RequestVehicle() {
  const { user } = useAuth();
  const addRequest = useFleetStore((s) => s.addRequest);
  const [, setLocation] = useLocation();

  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupTime, setPickupTime] = useState('08:00');
  const [returnTime, setReturnTime] = useState('17:00');
  const [passengers, setPassengers] = useState('1');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!destination.trim()) newErrors.destination = 'Destination is required';
    if (!purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!passengers || parseInt(passengers) < 1) newErrors.passengers = 'At least 1 passenger required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const request = addRequest({
      requester: user?.name ?? 'Unknown',
      department: user?.department ?? 'Unknown',
      destination: destination.trim(),
      startDate,
      endDate,
      purpose: purpose.trim(),
    });

    setSubmitting(false);
    setSubmitted(true);
    setSubmittedRequestId(request.id);

    toast({
      title: 'Request Submitted',
      description: `Request ${request.id} has been submitted successfully.`,
    });
  };

  const handleNewRequest = () => {
    setDestination('');
    setPurpose('');
    setStartDate('');
    setEndDate('');
    setPickupTime('08:00');
    setReturnTime('17:00');
    setPassengers('1');
    setSpecialRequirements('');
    setNotes('');
    setErrors({});
    setSubmitted(false);
    setSubmittedRequestId('');
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-lg py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Request Submitted Successfully</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your request <span className="data-mono font-semibold text-foreground">{submittedRequestId}</span> has been submitted and is pending review.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="outline" onClick={handleNewRequest}>
              Submit Another Request
            </Button>
            <Button onClick={() => setLocation('/my-requests')}>
              View My Requests
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <section className="mb-7 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Staff Workspace</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Request a Vehicle</h2>
        <p className="mt-2 text-sm text-muted-foreground">Submit a new vehicle request for your department</p>
      </section>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <section className="border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">New Request</h3>
          </div>
          <form onSubmit={handleSubmit} className="px-5 py-5">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Requester">
                  <Input value={user?.name ?? ''} readOnly className="bg-muted/50" />
                </FormField>
                <FormField label="Department">
                  <Input value={user?.department ?? ''} readOnly className="bg-muted/50" />
                </FormField>
              </div>

              <FormField label="Destination" required error={errors.destination}>
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination"
                  error={!!errors.destination}
                />
              </FormField>

              <FormField label="Purpose of Trip" required error={errors.purpose}>
                <Textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe the purpose of this trip..."
                  rows={3}
                  error={!!errors.purpose}
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Start Date" required error={errors.startDate}>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    error={!!errors.startDate}
                  />
                </FormField>
                <FormField label="End Date" required error={errors.endDate}>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    error={!!errors.endDate}
                  />
                </FormField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Pickup Time">
                  <Input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                  />
                </FormField>
                <FormField label="Expected Return Time">
                  <Input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                  />
                </FormField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Number of Passengers" required error={errors.passengers}>
                  <Input
                    type="number"
                    min="1"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    error={!!errors.passengers}
                  />
                </FormField>
                <FormField label="Special Requirements">
                  <Input
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    placeholder="E.g., wheelchair access, cargo space"
                  />
                </FormField>
              </div>

              <FormField label="Additional Notes">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information..."
                  rows={2}
                />
              </FormField>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDestination('');
                    setPurpose('');
                    setStartDate('');
                    setEndDate('');
                    setPickupTime('08:00');
                    setReturnTime('17:00');
                    setPassengers('1');
                    setSpecialRequirements('');
                    setNotes('');
                    setErrors({});
                  }}
                >
                  Clear Form
                </Button>
              </div>
            </div>
          </form>
        </section>

        <section className="border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Request Guidelines</h3>
          </div>
          <div className="px-5 py-4">
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                Submit requests at least 24 hours in advance
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                Include clear purpose and destination details
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                Requests are reviewed by the Fleet Manager
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                You will be notified once approved or declined
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
