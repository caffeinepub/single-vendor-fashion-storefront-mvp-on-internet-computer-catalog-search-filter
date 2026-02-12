import { useAllReturnRequests, useProcessReturnRequest, useCompleteRefund } from '../../hooks/admin/useAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function AdminReturnsPage() {
  const { data: returns = [], isLoading } = useAllReturnRequests();
  const processReturn = useProcessReturnRequest();
  const completeRefund = useCompleteRefund();

  const handleApprove = async (returnId: string) => {
    try {
      await processReturn.mutateAsync({ returnId, approved: true });
      toast.success('Return request approved');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve return');
    }
  };

  const handleReject = async (returnId: string) => {
    try {
      await processReturn.mutateAsync({ returnId, approved: false });
      toast.success('Return request rejected');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject return');
    }
  };

  const handleCompleteRefund = async (returnId: string) => {
    try {
      await completeRefund.mutateAsync(returnId);
      toast.success('Refund completed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete refund');
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-light mb-8">Return Management</h1>

      <div className="space-y-4">
        {returns.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">No return requests</p>
            </CardContent>
          </Card>
        ) : (
          returns.map((returnReq) => {
            const date = new Date(Number(returnReq.createdAt) / 1000000);

            return (
              <Card key={returnReq.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-normal">Return #{returnReq.id}</CardTitle>
                    <Badge variant="outline">{returnReq.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Order ID</p>
                      <p>{returnReq.orderId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Customer</p>
                      <p className="truncate">{returnReq.customer.toString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p>{date.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="capitalize">{returnReq.status}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Reason</p>
                    <p className="text-sm text-muted-foreground">{returnReq.reason}</p>
                  </div>

                  {returnReq.status === 'pending' && (
                    <div className="flex gap-3 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(returnReq.id)}
                        disabled={processReturn.isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(returnReq.id)}
                        disabled={processReturn.isPending}
                      >
                        Reject
                      </Button>
                    </div>
                  )}

                  {returnReq.status === 'approved' && (
                    <Button
                      size="sm"
                      onClick={() => handleCompleteRefund(returnReq.id)}
                      disabled={completeRefund.isPending}
                    >
                      Complete Refund
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
