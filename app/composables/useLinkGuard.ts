export function useLinkGuard() {
  const warn = ref<{ open: (href: string) => void } | null>(null);

  function onLink(e: MouseEvent) {
    const a = (e.target as HTMLElement).closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href) return;
    e.preventDefault();
    warn.value?.open(href);
  }

  return { warn, onLink };
}
