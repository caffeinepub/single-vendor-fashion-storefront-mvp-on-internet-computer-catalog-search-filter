import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TermsPage() {
  return (
    <div className="container py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-light">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-normal mt-8 mb-4">Agreement to Terms</h2>
          <p>
            By accessing and using ATELIER's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>

          <h2 className="text-xl font-normal mt-8 mb-4">Use of Service</h2>
          <p>You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Transmit any harmful or malicious code</li>
            <li>Attempt to gain unauthorized access to our systems</li>
          </ul>

          <h2 className="text-xl font-normal mt-8 mb-4">Orders and Payment</h2>
          <p>
            All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Prices are subject to change without notice.
          </p>

          <h2 className="text-xl font-normal mt-8 mb-4">Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and images, is the property of ATELIER and protected by copyright and other intellectual property laws.
          </p>

          <h2 className="text-xl font-normal mt-8 mb-4">Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, ATELIER shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our service.
          </p>

          <h2 className="text-xl font-normal mt-8 mb-4">Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Continued use of the service after changes constitutes acceptance of the modified Terms.
          </p>

          <h2 className="text-xl font-normal mt-8 mb-4">Contact Information</h2>
          <p>
            For questions about these Terms, please contact us through our website.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
