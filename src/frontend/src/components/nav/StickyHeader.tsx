import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, User, Menu, Search, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { LoginButton } from '../auth/LoginButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useCart } from '../../hooks/cart/useCart';
import { useUserRole } from '../../hooks/auth/useUserRole';
import { HeaderSearch } from '../search/HeaderSearch';
import { useState } from 'react';

export function StickyHeader() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: cart = [] } = useCart();
  const { data: userRole } = useUserRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isAuthenticated = !!identity;
  const isAdmin = userRole === 'admin';
  const cartItemCount = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img 
            src="/assets/generated/logo-icon.dim_256x256.png" 
            alt="Store logo"
            className="h-8 w-8"
          />
          <span className="hidden sm:inline-block font-light text-xl tracking-tight">ATELIER</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <HeaderSearch />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {isAdmin && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
          )}
          
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate({ to: '/account/orders' })}>
                  Order History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <LoginButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {!isAuthenticated && <LoginButton />}
          
          <Button variant="ghost" size="sm" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-4 w-4" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="ghost" size="sm" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </Button>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                <div className="pb-4 border-b">
                  <HeaderSearch />
                </div>
                
                {isAdmin && (
                  <Button variant="outline" className="justify-start" asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/admin">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  </Button>
                )}
                
                {isAuthenticated && (
                  <Button variant="outline" className="justify-start" asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/account/orders">
                      <User className="h-4 w-4 mr-2" />
                      Order History
                    </Link>
                  </Button>
                )}
                
                <LoginButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="md:hidden border-t px-4 py-3">
        <HeaderSearch />
      </div>
    </header>
  );
}
