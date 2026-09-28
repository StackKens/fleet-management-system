import { useState } from 'react';
import { Link } from 'wouter';
import { ClipboardList, Eye, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { TableLoading } from '@/components/ui/loading-state';
import { Pagination } from '@/components/ui/pagination';
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

export default function MyRequests() {
  const { user } = useAuth();
  const { data: requests, isLoading } = useRequests();
  const cancelRequest = useFleetStore((s) => s.cancelRequest);

  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<VehicleRequest | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<VehicleRequest | null>(null);
  const perPage = 8;

  // Filter to show only current user's requests
  const myRequests = (requests ?? []).filter(
    (r) => r.requester === user?.name || r.requester.includes(user?.name?.split(' ')[0] ?? ''),
  );

  const totalPages = Math.ceil(myRequests.length / perPage);
  const paginated = myRequests.slice((page - 1) * perPage, page * perPage);

  const pendingCount = myRequests.filter((r) => r.status === 'Pending').length;
  const approvedCount = myRequests.filter((r) => r.status === 'Approved').length;

  const handleCancel = () => {
    if (!cancelConfirm) return;
    cancelRequest(cancelConfirm.id);
    toast({
      title: 'Request Cancelled',
      description: `Request ${cancelConfirm.id} has been cancelled.`,
    });
    setCancelConfirm(null);
    setSelectedRequest(null);
  };

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="My Requests"
        description="Track your vehicle requests and their status"
        actions={
          <Link href="/request-vehicle">
            <Button size="sm">
              <ClipboardList className="h-3.5 w-3.5" />
              New Request
            </Button>
          </Link>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Total requests</p>
          <p className="data-mono mt-1 text-xl font-semibold">{myRequests.length}</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="data-mono mt-1 text-xl font-semibold text-amber-700">{pendingCount}</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Approved</p>
          <p className="data-mono mt-1 text-xl font-semibold text-emerald-700">{approvedCount}</p>
        </Card>
        <Card className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="data-mono mt-1 text-xl font-semibold text-foreground">
            {myRequests.filter((r) => r.status === 'Completed').length}
          </p>
        </Card>
      </div>

      <Card>
        {isLoading ? (
          <TableLoading />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-5 w-5" />}
            title="No requests found"
            description="You haven't submitted any vehicle requests yet."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Request</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Destination</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Dates</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((request) => (
                    <tr key={request.id} className="border-b border-border last:border-b-0">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground">{request.id}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{request.department}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">{request.destination}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {request.startDate} — {request.endDate}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={statusVariant[request.status]} dot>
                          {request.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedRequest(request)}
                            className="h-7 px-2 text-[11px]"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          {request.status === 'Pending' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setCancelConfirm(request)}
                              className="h-7 px-2 text-[11px] text-destructive hover:text-destructive"
                            >
                              <XCircle className="h-3 w-3" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={myRequests.length}
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
          <Button variant="outline" onClick={() => setSelectedRequest(null)}>
            Close
          </Button>
        }
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
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

      {/* Cancel Confirmation Modal */}
      <Modal
        open={!!cancelConfirm}
        onClose={() => setCancelConfirm(null)}
        title="Cancel Request"
        description={cancelConfirm ? `Are you sure you want to cancel request ${cancelConfirm.id}?` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => setCancelConfirm(null)}>
              Keep Request
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Yes, Cancel Request
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. The request will be marked as cancelled and the Fleet Manager will be notified.
        </p>
      </Modal>
    </div>
  );
}
