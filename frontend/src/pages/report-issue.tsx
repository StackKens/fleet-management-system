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
import type { IssueType, IssueSeverity } from '@/data/types';

export default function ReportIssue() {
  const { user } = useAuth();
  const { data: vehicles } = useVehicles();
  const addIssue = useFleetStore((s) => s.addIssue);
  const issues = useFleetStore((s) => s.issues);

  const [issueType, setIssueType] = useState<IssueType>('Vehicle problem');
  const [vehicleReg, setVehicleReg] = useState('');
  const [severity, setSeverity] = useState<IssueSeverity>('Medium');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const myIssues = issues.filter(
    (i) => i.reportedBy === user?.name || i.reportedBy.includes(user?.name?.split(' ')[0] ?? ''),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleReg || !description || !location) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    addIssue({
      vehicle: vehicleReg,
      type: issueType,
      severity,
      description,
      location,
      reportedBy: user?.name ?? 'Unknown',
    });

    setSubmitting(false);
    setSubmitted(true);

    toast({
      title: 'Issue Reported',
      description: `Your ${issueType.toLowerCase()} for ${vehicleReg} has been reported successfully.`,
    });
  };

  const handleNewReport = () => {
    setIssueType('Vehicle problem');
    setVehicleReg('');
    setSeverity('Medium');
    setDescription('');
    setLocation('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-lg py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Issue Reported Successfully</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your {issueType.toLowerCase()} for {vehicleReg} has been reported. The Fleet Manager has been notified.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="outline" onClick={handleNewReport}>
              Report Another Issue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Report an Issue"
        description="Report vehicle problems, incidents, or accidents"
      />

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <section className="border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Submit Report</h3>
          </div>
          <form onSubmit={handleSubmit} className="px-5 py-5">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Issue Type" required>
                  <Select value={issueType} onChange={(e) => setIssueType(e.target.value as IssueType)}>
                    <option value="Vehicle problem">Vehicle problem</option>
                    <option value="Accident">Accident</option>
                    <option value="Incident">Incident</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormField>
                <FormField label="Vehicle" required>
                  <Select value={vehicleReg} onChange={(e) => setVehicleReg(e.target.value)}>
                    <option value="">Select vehicle...</option>
                    {(vehicles ?? []).map((v) => (
                      <option key={v.id} value={v.registration}>
                        {v.registration} — {v.make} {v.model}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>
              <FormField label="Severity" required>
                <Select value={severity} onChange={(e) => setSeverity(e.target.value as IssueSeverity)}>
                  <option value="Low">Low - Minor issue</option>
                  <option value="Medium">Medium - Needs attention</option>
                  <option value="High">High - Urgent</option>
                  <option value="Critical">Critical - Safety risk</option>
                </Select>
              </FormField>
              <FormField label="Description" required>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                />
              </FormField>
              <FormField label="Location" required>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where did this occur?"
                />
              </FormField>
              <Button type="submit" className="w-full" disabled={submitting}>
                <CheckCircle2 className="h-4 w-4" />
                {submitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        </section>

        <section className="border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Reports</h3>
          </div>
          <div className="divide-y divide-border">
            {myIssues.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No issues reported yet.
              </div>
            ) : (
              myIssues.slice(0, 5).map((issue) => (
                <div key={issue.id} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">{issue.type}</p>
                    <Badge variant={issue.status === 'Resolved' ? 'success' : issue.status === 'In progress' ? 'info' : 'warning'} dot>
                      {issue.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {issue.vehicle} · {issue.severity} · {issue.date}
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
