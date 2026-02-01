export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, session } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo("/auth/login");
  }

  if (session.value?.user?.role !== "GLOBAL_ADMIN") {
    return navigateTo("/dashboard");
  }
});
