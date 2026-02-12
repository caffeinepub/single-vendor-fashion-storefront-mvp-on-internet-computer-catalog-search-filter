import { Link } from '@tanstack/react-router';
import { useAnalytics } from '../../hooks/admin/useAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export function AdminDashboardPage() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const revenue = analytics ? (Number(analytics.revenueTotal) / 100).toFixed(2) : '0.00';

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light">Admin Dashboard</h1>
      </div>

      {/* Analytics Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.ordersCount.toString() || '0'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Products</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.topProducts.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      {analytics && analytics.topProducts.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-normal">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topProducts.slice(0, 5).map(([productId, sales]) => (
                <div key={productId} className="flex justify-between items-center">
                  <span className="text-sm">{productId}</span>
                  <span className="text-sm font-medium">{sales.toString()} sold</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-normal">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your product catalog and inventory
            </p>
            <Button asChild className="w-full">
              <Link to="/admin/products">
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-normal">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View and manage customer orders
            </p>
            <Button asChild className="w-full">
              <Link to="/admin/orders">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Manage Orders
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-normal">Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Process return and refund requests
            </p>
            <Button asChild className="w-full">
              <Link to="/admin/returns">Manage Returns</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
