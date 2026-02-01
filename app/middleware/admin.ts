export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, session } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo("/auth/login");
  }

  const role = session.value?.user?.role;
  if (role !== "PROGRAM_ADMIN" && role !== "GLOBAL_ADMIN") {
    return navigateTo("/dashboard");
  }

  if (role === "GLOBAL_ADMIN") return;

  const { data: programs } = await useFetch<{ id: string }[]>("/api/users/me/programs");
  if (!programs.value?.length) {
    return navigateTo("/dashboard");
  }
});
