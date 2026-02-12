import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'cookieConsent';

export function useCookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored === null) {
      setShowBanner(true);
      setConsent(null);
    } else {
      setConsent(stored === 'true');
      setShowBanner(false);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setConsent(true);
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'false');
    setConsent(false);
    setShowBanner(false);
  };

  const reopenBanner = () => {
    setShowBanner(true);
  };

  return {
    showBanner,
    consent,
    acceptCookies,
    declineCookies,
    reopenBanner
  };
}
