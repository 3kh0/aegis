export function useApi() {
  const busy = ref(false);
  const err = ref("");

  async function run<T>(fn: () => Promise<T>): Promise<T | null> {
    busy.value = true;
    err.value = "";
    try {
      return await fn();
    } catch (e) {
      err.value = e.data?.message || e.message || "Something went wrong";
      return null;
    } finally {
      busy.value = false;
    }
  }

  return { busy, err, run };
}
