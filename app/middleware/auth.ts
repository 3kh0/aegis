export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();
  // console.log("[auth middleware] Route:", to.path, "| loggedIn:", loggedIn.value, "| user:", user.value);

  if (!loggedIn.value) {
    // console.log("[auth middleware] Not logged in, redirecting to /auth/login");
    return navigateTo(`/auth/login?to=${encodeURIComponent(to.fullPath)}`);
  }
});
