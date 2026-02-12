import { useState } from 'react';
import { useInitiateReturn } from '../../hooks/returns/useReturns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface InitiateReturnFormProps {
  orderId: string;
}

export function InitiateReturnForm({ orderId }: InitiateReturnFormProps) {
  const [reason, setReason] = useState('');
  const initiateReturn = useInitiateReturn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    try {
      await initiateReturn.mutateAsync({ orderId, reason: reason.trim() });
      toast.success('Return request submitted');
      setReason('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit return request');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Return</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please describe why you'd like to return this order..."
          rows={4}
          required
        />
      </div>
      <Button type="submit" disabled={initiateReturn.isPending || !reason.trim()}>
        {initiateReturn.isPending ? 'Submitting...' : 'Submit Return Request'}
      </Button>
    </form>
  );
}
