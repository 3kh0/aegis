export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, session } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo("/auth/login");
  }

  const role = session.value?.user?.role;
  if (role !== "PROGRAM_ADMIN" && role !== "GLOBAL_ADMIN") {
    return navigateTo("/dashboard");
  }

  if (role === "GLOBAL_ADMIN") return;

  const { data: programs } = await useFetch<{ id: string; slug: string }[]>("/api/users/me/programs");

  if (!programs.value?.length) {
    return navigateTo("/dashboard");
  }

  const slug = to.params.slug as string;
  if (!slug) return;

  const hasAccess = programs.value.some((p) => p.slug === slug);
  if (!hasAccess) {
    return navigateTo("/admin/programs");
  }
});
