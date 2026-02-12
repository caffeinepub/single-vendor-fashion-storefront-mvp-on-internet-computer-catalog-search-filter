import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '../../hooks/compliance/useCookieConsent';
import { Cookie } from 'lucide-react';

export function CookieConsentBanner() {
  const { showBanner, acceptCookies, declineCookies } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur border-t shadow-lg">
      <div className="container max-w-4xl">
        <Alert>
          <Cookie className="h-5 w-5" />
          <AlertTitle>Cookie Preferences</AlertTitle>
          <AlertDescription className="mt-2 mb-4">
            We use cookies to enhance your browsing experience and analyze site traffic. 
            By clicking "Accept", you consent to our use of cookies.
          </AlertDescription>
          <div className="flex gap-3">
            <Button onClick={acceptCookies} size="sm">
              Accept
            </Button>
            <Button onClick={declineCookies} variant="outline" size="sm">
              Decline
            </Button>
          </div>
        </Alert>
      </div>
    </div>
  );
}
