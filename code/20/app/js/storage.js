export function createMemoryStore() {
  const data = new Map();
  return {
    get(key) {
      return data.get(key);
    },
    set(key, value) {
      data.set(key, value);
    },
  };
}

export function createLocalStore(prefix = 'vocab') {
  const keyFor = (key) => `${prefix}:${key}`;
  return {
    get(key, fallback = null) {
      const raw = localStorage.getItem(keyFor(key));
      return raw ? JSON.parse(raw) : fallback;
    },
    set(key, value) {
      localStorage.setItem(keyFor(key), JSON.stringify(value));
    },
  };
}
