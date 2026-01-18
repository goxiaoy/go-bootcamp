export function createLocalStore(prefix = 'vocab') {
  const keyFor = (key: string) => `${prefix}:${key}`;

  return {
    get<T>(key: string, fallback: T) {
      const raw = localStorage.getItem(keyFor(key));
      return raw ? (JSON.parse(raw) as T) : fallback;
    },
    set<T>(key: string, value: T) {
      localStorage.setItem(keyFor(key), JSON.stringify(value));
    },
  };
}
