import { ReactNode } from 'react';
import { useUserRole } from '../../hooks/auth/useUserRole';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { data: userRole, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="container py-16">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <div className="container py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-16">
            <Alert variant="destructive">
              <ShieldAlert className="h-5 w-5" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription className="mt-2">
                You do not have permission to access this area. Admin privileges are required.
              </AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button asChild>
                <Link to="/">Return to Store</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
