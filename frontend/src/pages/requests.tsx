import { useState } from 'react';
import { Plus, ClipboardList, Search, Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { TableLoading } from '@/components/ui/loading-state';
import { Pagination } from '@/components/ui/pagination';
import { Modal } from '@/components/ui/modal';
import { useAuth } from '@/contexts/auth-context';
import { useFleetStore } from '@/stores/fleet-store';
import { useRequests } from '@/hooks/use-fleet-data';
import { toast } from '@/hooks/use-toast';
import type { RequestStatus, VehicleRequest } from '@/data/types';

const statusVariant: Record<RequestStatus, 'warning' | 'success' | 'danger' | 'default'> = {
  Pending: 'warning',
  Approved: 'success',
  Declined: 'danger',
  Completed: 'default',
};

export default function Requests() {
  const { user } = useAuth();
  const { data: requests, isLoading } = useRequests();
  const updateRequestStatus = useFleetStore((s) => s.updateRequestStatus);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<VehicleRequest | null>(null);
  const [reviewModal, setReviewModal] = useState<{ request: VehicleRequest; action: 'approve' | 'decline' } | null>(null);
  const [reviewReason, setReviewReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const perPage = 8;

  const filtered = (requests ?? []).filter((r) => {
    const matchesSearch =
      !search ||
      r.requester.toLowerCase().includes(search.toLowerCase()) ||
      r.destination.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const pendingCount = (requests ?? []).filter((r) => r.status === 'Pending').length;

  const handleReview = (request: VehicleRequest, action: 'approve' | 'decline') => {
    setReviewModal({ request, action });
    setReviewReason('');
  };

  const handleSubmitReview = async () => {
    if (!reviewModal) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newStatus: RequestStatus = reviewModal.action === 'approve' ? 'Approved' : 'Declined';
    updateRequestStatus(reviewModal.request.id, newStatus, user?.name, reviewReason || undefined);

    setSubmitting(false);
    setReviewModal(null);
    setSelectedRequest(null);
    setReviewReason('');

    toast({
      title: `Request ${newStatus}`,
      description: `${reviewModal.request.id} has been ${newStatus.toLowerCase()}.`,
    });
  };

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Vehicle Requests"
        description="Request intake, review and approval workflows."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            New request
          </Button>
        }
      />

      {pendingCount > 0 && (
        <div className="mb-6 border border-amber-200 bg-amber-50 px-5 py-3 text-xs text-amber-800">
          <span className="font-semibold">{pendingCount} request{pendingCount > 1 ? 's' : ''}</span> pending review
        </div>
      )}

      <Card>
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search requester, destination, ID..."
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="sm:max-w-[160px]"
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Declined">Declined</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>

        {isLoading ? (
          <TableLoading />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-5 w-5" />}
            title="No requests found"
            description={search || statusFilter ? 'Try adjusting your search or filters.' : 'No vehicle requests have been submitted yet.'}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <p className="font-semibold text-foreground">{request.requester}</p>
                      <p className="data-mono text-[10px] text-muted-foreground">{request.id}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{request.department}</TableCell>
                    <TableCell className="font-medium text-foreground">{request.destination}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {request.startDate} — {request.endDate}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{request.purpose}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[request.status]} dot>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReview(request, 'approve')}
                            className="h-7 px-2 text-[11px]"
                          >
                            <Check className="h-3 w-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReview(request, 'decline')}
                            className="h-7 px-2 text-[11px] text-destructive hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedRequest(request)}
                            className="h-7 px-2 text-[11px]"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedRequest(request)}
                          className="h-7 px-2 text-[11px]"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                      )}
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

      {/* View Request Modal */}
      <Modal
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={selectedRequest ? `Request ${selectedRequest.id}` : ''}
        description={selectedRequest ? `${selectedRequest.requester} — ${selectedRequest.department}` : undefined}
        footer={
          selectedRequest?.status === 'Pending' ? (
            <>
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReview(selectedRequest, 'decline')}
              >
                <X className="h-4 w-4" />
                Decline
              </Button>
              <Button onClick={() => handleReview(selectedRequest, 'approve')}>
                <Check className="h-4 w-4" />
                Approve
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Close
            </Button>
          )
        }
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="mt-1 font-medium text-foreground">{selectedRequest.destination}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Purpose</p>
                <p className="mt-1 font-medium text-foreground">{selectedRequest.purpose}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start date</p>
                <p className="mt-1 font-medium text-foreground">{selectedRequest.startDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End date</p>
                <p className="mt-1 font-medium text-foreground">{selectedRequest.endDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="mt-1 font-medium text-foreground">{selectedRequest.vehicle ?? 'Not assigned'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Driver</p>
                <p className="mt-1 font-medium text-foreground">{selectedRequest.driver ?? 'Not assigned'}</p>
              </div>
            </div>
            {selectedRequest.reviewedBy && (
              <div className="border-t border-border pt-4 text-xs text-muted-foreground">
                Reviewed by {selectedRequest.reviewedBy} on {selectedRequest.reviewedDate}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Review Modal (Approve/Decline with reason) */}
      <Modal
        open={!!reviewModal}
        onClose={() => { setReviewModal(null); setReviewReason(''); }}
        title={reviewModal ? `${reviewModal.action === 'approve' ? 'Approve' : 'Decline'} Request ${reviewModal.request.id}` : ''}
        description={reviewModal ? `${reviewModal.request.requester} — ${reviewModal.request.destination}` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => { setReviewModal(null); setReviewReason(''); }}>
              Cancel
            </Button>
            <Button
              variant={reviewModal?.action === 'decline' ? 'destructive' : 'default'}
              onClick={handleSubmitReview}
              disabled={submitting}
            >
              {submitting ? 'Processing...' : reviewModal?.action === 'approve' ? 'Approve Request' : 'Decline Request'}
            </Button>
          </>
        }
      >
        {reviewModal && (
          <div className="space-y-4">
            <div className="rounded-md border border-border bg-muted/30 px-4 py-3 text-sm">
              <p className="font-medium text-foreground">{reviewModal.request.requester}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {reviewModal.request.destination} · {reviewModal.request.startDate} — {reviewModal.request.endDate}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{reviewModal.request.purpose}</p>
            </div>
            <FormField label={reviewModal.action === 'decline' ? 'Reason for Decline (required)' : 'Notes (optional)'}>
              <Textarea
                value={reviewReason}
                onChange={(e) => setReviewReason(e.target.value)}
                placeholder={reviewModal.action === 'decline' ? 'Explain why this request is being declined...' : 'Add any notes for the requester...'}
                rows={3}
              />
            </FormField>
          </div>
        )}
      </Modal>
    </div>
  );
}
