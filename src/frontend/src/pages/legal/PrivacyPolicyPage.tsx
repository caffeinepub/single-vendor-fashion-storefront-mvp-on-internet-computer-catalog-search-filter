import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PrivacyPolicyPage() {
  return (
    <div className="container py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-light">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-normal mt-8 mb-4">Introduction</h2>
          <p>
            ATELIER ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>

          <h2 className="text-xl font-normal mt-8 mb-4">Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact information</li>
            <li>Shipping and billing addresses</li>
            <li>Payment information (processed securely)</li>
            <li>Order history and preferences</li>
            <li>Communications with us</li>
          </ul>

          <h2 className="text-xl font-normal mt-8 mb-4">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders</li>
            <li>Improve our products and services</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-normal mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2 className="text-xl font-normal mt-8 mb-4">Your Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Data portability</li>
          </ul>

          <h2 className="text-xl font-normal mt-8 mb-4">Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us through our website.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
