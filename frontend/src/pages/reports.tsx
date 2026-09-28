import { useState } from 'react';
import { BarChart3, Download, FileText, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useReports } from '@/hooks/use-fleet-data';
import { toast } from '@/hooks/use-toast';
import type { Report, ReportType } from '@/data/types';

const reportTypeVariant: Record<ReportType, 'default' | 'info' | 'success' | 'warning' | 'danger' | 'primary'> = {
  'Vehicle utilization': 'info',
  'Fuel consumption': 'warning',
  'Maintenance costs': 'danger',
  'Trip summary': 'default',
  'Driver activity': 'success',
  'Fleet status': 'primary',
  'Expense summary': 'warning',
  'Request summary': 'default',
};

export default function Reports() {
  const { data: reports, isLoading } = useReports();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [generating, setGenerating] = useState(false);

  const filtered = (reports ?? []).filter((r) => {
    const matchesSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const reportTypes = [...new Set((reports ?? []).map((r) => r.type))];

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setGenerating(false);
    toast({
      title: 'Report Generated',
      description: 'A new fleet status report has been generated successfully.',
    });
  };

  const handleExport = (report: Report) => {
    toast({
      title: 'Export Started',
      description: `Exporting ${report.title}...`,
    });
  };

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Reports"
        description="Fleet performance and operational reports."
        actions={
          <Button onClick={handleGenerate} disabled={generating}>
            <FileText className="h-4 w-4" />
            {generating ? 'Generating...' : 'Generate report'}
          </Button>
        }
      />

      <Card className="mb-6">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="pl-9"
            />
          </div>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="sm:max-w-[200px]"
          >
            <option value="">All report types</option>
            {reportTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
      </Card>

      {isLoading ? (
        <LoadingState message="Loading reports..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BarChart3 className="h-5 w-5" />}
          title="No reports found"
          description={search || typeFilter ? 'Try adjusting your search or filters.' : 'No reports have been generated yet.'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((report) => (
            <Card key={report.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm">{report.title}</CardTitle>
                  <Badge variant={reportTypeVariant[report.type] ?? 'default'}>
                    {report.type}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Period: {report.period}</span>
                  <span>Generated: {report.generatedDate}</span>
                </div>
              </CardContent>
              <div className="flex items-center gap-2 border-t border-border px-5 py-3">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedReport(report)}>
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleExport(report)}>
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Report Detail Modal */}
      <Modal
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport?.title ?? ''}
        description={selectedReport ? `${selectedReport.type} — ${selectedReport.period}` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Close
            </Button>
            <Button onClick={() => selectedReport && handleExport(selectedReport)}>
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </>
        }
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="rounded-md border border-border bg-muted/30 px-4 py-3">
              <p className="text-sm text-foreground">{selectedReport.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Report Type</p>
                <Badge variant={reportTypeVariant[selectedReport.type] ?? 'default'}>
                  {selectedReport.type}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Period</p>
                <p className="mt-1 font-medium text-foreground">{selectedReport.period}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Generated</p>
                <p className="mt-1 font-medium text-foreground">{selectedReport.generatedDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Report ID</p>
                <p className="data-mono mt-1 font-medium text-foreground">{selectedReport.id}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
