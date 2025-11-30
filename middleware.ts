import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/quests(.*)',
  '/badges(.*)',
  '/skilltree(.*)',
  '/stats(.*)',
  '/profile(.*)',
  '/form(.*)',
  '/diagnostic(.*)',
]);

const isPublicRoute = createRouteMatcher([
  '/auth(.*)',
  '/',
  '/api/webhooks(.*)'
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
