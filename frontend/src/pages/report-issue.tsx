import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ReportIssue() {

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <section className="mb-7 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Driver Workspace</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Report an Issue</h2>
        <p className="mt-2 text-sm text-muted-foreground">Report vehicle problems, incidents, or accidents</p>
      </section>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <section className="border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Submit Report</h3>
          </div>
          <div className="px-5 py-5">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Issue Type</label>
                <select className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm">
                  <option>Vehicle problem</option>
                  <option>Accident</option>
                  <option>Incident</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Vehicle</label>
                <select className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm">
                  <option>UG 1234 A</option>
                  <option>UG 5678 B</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Severity</label>
                <select className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm">
                  <option>Low - Minor issue</option>
                  <option>Medium - Needs attention</option>
                  <option>High - Urgent</option>
                  <option>Critical - Safety risk</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
                <textarea className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" rows={4} placeholder="Describe the issue in detail..." />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Location</label>
                <input type="text" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" placeholder="Where did this occur?" />
              </div>
              <Button className="w-full">
                <CheckCircle2 className="h-4 w-4" />
                Submit Report
              </Button>
            </div>
          </div>
        </section>

        <section className="border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Reports</h3>
          </div>
          <div className="divide-y divide-border">
            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">Brake noise</p>
                <Badge variant="warning" dot>In Progress</Badge>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">UG 1234 A · 2024-07-15</p>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">Engine warning light</p>
                <Badge variant="success" dot>Resolved</Badge>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">UG 1234 A · 2024-07-10</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
