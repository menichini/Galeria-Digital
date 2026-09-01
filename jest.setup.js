// jest.setup.js
require('@testing-library/jest-dom');

// Mock next/router for client components
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock sessionStorage
class SessionStorageMock {
  store = {};
  getItem(key) { return this.store[key] || null; }
  setItem(key, value) { this.store[key] = String(value); }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}

Object.defineProperty(window, 'sessionStorage', {
  value: new SessionStorageMock(),
});
