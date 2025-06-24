import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  // An array of routes that should be accessible to both signed-in and signed-out users.
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)'
  ],
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};