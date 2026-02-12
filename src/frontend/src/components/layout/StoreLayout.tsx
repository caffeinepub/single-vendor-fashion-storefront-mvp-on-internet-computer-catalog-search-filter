import { Outlet } from '@tanstack/react-router';
import { StickyHeader } from '../nav/StickyHeader';
import { Footer } from './Footer';
import { CookieConsentBanner } from '../compliance/CookieConsentBanner';

export function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <StickyHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsentBanner />
    </div>
  );
}
