export function createPlayhead(initial = 0) {
  let value = initial;
  const listeners = new Set<() => void>();

  return {
    read: () => value,
    write(next: number) {
      if (next === value) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export type Playhead = ReturnType<typeof createPlayhead>;
