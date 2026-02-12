import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '../../hooks/compliance/useCookieConsent';

export function Footer() {
  const { reopenBanner } = useCookieConsent();
  const currentYear = new Date().getFullYear();
  
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname)
    : 'unknown-app';

  return (
    <footer className="border-t bg-muted/30 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <img 
              src="/assets/generated/logo-wordmark.dim_800x240.png" 
              alt="ATELIER"
              className="h-8 w-auto"
            />
            <p className="text-sm text-muted-foreground">
              Curated fashion for the modern wardrobe.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-medium mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-medium mb-3">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/account/orders" className="text-muted-foreground hover:text-foreground">
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-muted-foreground hover:text-foreground">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
                  onClick={reopenBanner}
                >
                  Cookie Preferences
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} ATELIER. Built with <Heart className="inline h-3 w-3 text-destructive fill-destructive" /> using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
