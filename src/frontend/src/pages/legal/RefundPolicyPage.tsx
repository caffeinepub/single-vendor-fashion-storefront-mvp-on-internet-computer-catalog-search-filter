import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RefundPolicyPage() {
  return (
    <div className="container py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-light">Refund Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-normal mt-8 mb-4">Return Eligibility</h2>
          <p>
            We want you to be completely satisfied with your purchase. If you're not happy with your order, you may return it within 30 days of delivery for a full refund.
          </p>

          <h2 className="text-xl font-normal mt-8 mb-4">Return Conditions</h2>
          <p>To be eligible for a return, items must:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be in original condition with tags attached</li>
            <li>Be unworn and unwashed</li>
            <li>Include original packaging</li>
            <li>Have proof of purchase</li>
          </ul>

          <h2 className="text-xl font-normal mt-8 mb-4">How to Initiate a Return</h2>
          <p>To start a return:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Log in to your account and go to Order History</li>
            <li>Select the order you wish to return</li>
            <li>Click "Request Return" and provide a reason</li>
            <li>Wait for approval from our team</li>
            <li>Ship the item back using the provided instructions</li>
          </ol>

          <h2 className="text-xl font-normal mt-8 mb-4">Refund Processing</h2>
          <p>
            Once we receive and inspect your return, we'll process your refund within 5-7 business days. The refund will be issued to your original payment method.
          </p>

          <h2 className="text-xl font-normal mt-8 mb-4">Non-Returnable Items</h2>
          <p>The following items cannot be returned:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Final sale items</li>
            <li>Gift cards</li>
            <li>Items marked as non-returnable</li>
          </ul>

          <h2 className="text-xl font-normal mt-8 mb-4">Exchanges</h2>
          <p>
            We currently do not offer direct exchanges. If you need a different size or color, please return the original item and place a new order.
          </p>

          <h2 className="text-xl font-normal mt-8 mb-4">Questions</h2>
          <p>
            If you have any questions about our refund policy, please contact us through our website.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
