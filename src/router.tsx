import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router'
import App from './App'
import DiscountsPage from './pages/DiscountsPage'

// Create the root route
const rootRoute = createRootRoute()

// Create the index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

// Create the discounts route
const discountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/discounts',
  component: DiscountsPage,
})

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, discountsRoute])

// Create the router
export const router = createRouter({ routeTree })

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
