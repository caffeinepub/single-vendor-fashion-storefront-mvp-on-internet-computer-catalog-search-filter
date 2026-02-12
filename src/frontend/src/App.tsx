import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { StoreLayout } from './components/layout/StoreLayout';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrdersPage } from './pages/account/OrdersPage';
import { OrderDetailPage } from './pages/account/OrderDetailPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminReturnsPage } from './pages/admin/AdminReturnsPage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { RefundPolicyPage } from './pages/legal/RefundPolicyPage';
import { AdminRouteGuard } from './components/auth/AdminRouteGuard';
import { ProfileSetupModal } from './components/auth/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <ProfileSetupModal />
      <StoreLayout />
    </>
  )
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CatalogPage
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: ProductDetailPage
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order/$orderId',
  component: OrderConfirmationPage
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account/orders',
  component: OrdersPage
});

const orderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account/orders/$orderId',
  component: OrderDetailPage
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRouteGuard>
      <AdminDashboardPage />
    </AdminRouteGuard>
  )
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: () => (
    <AdminRouteGuard>
      <AdminProductsPage />
    </AdminRouteGuard>
  )
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: () => (
    <AdminRouteGuard>
      <AdminOrdersPage />
    </AdminRouteGuard>
  )
});

const adminReturnsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/returns',
  component: () => (
    <AdminRouteGuard>
      <AdminReturnsPage />
    </AdminRouteGuard>
  )
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPolicyPage
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage
});

const refundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/refund-policy',
  component: RefundPolicyPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  ordersRoute,
  orderDetailRoute,
  adminDashboardRoute,
  adminProductsRoute,
  adminOrdersRoute,
  adminReturnsRoute,
  privacyRoute,
  termsRoute,
  refundRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
