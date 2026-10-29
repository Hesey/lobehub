/* eslint-disable import/newline-after-import,import/first */
import '@testing-library/jest-dom';
import { theme } from 'antd';
// mock indexedDB to test with dexie
// refs: https://github.com/dumbmatter/fakeIndexedDB#dexie-and-other-indexeddb-api-wrappers
import 'fake-indexeddb/auto';
import React from 'react';
import { vi } from 'vitest';

const createStorageMock = () => {
  const storage = new Map<string, string>();

  return {
    clear: () => storage.clear(),
    getItem: (key: string) => storage.get(key) ?? null,
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    get length() {
      return storage.size;
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    setItem: (key: string, value: string) => storage.set(key, String(value)),
  };
};

// Global mock for @lobehub/analytics/react to avoid AnalyticsProvider dependency
// This prevents tests from failing when components use useAnalytics hook
vi.mock('@lobehub/analytics/react', () => ({
  useAnalytics: () => ({
    analytics: {
      track: vi.fn(),
    },
  }),
}));

// node runtime
if (typeof window === 'undefined') {
  // test with polyfill crypto
  const { Crypto } = await import('@peculiar/webcrypto');

  Object.defineProperty(global, 'crypto', {
    value: new Crypto(),
    writable: true,
  });
}

// remove antd hash on test
theme.defaultConfig.hashed = false;

// Bun + happy-dom can expose a broken localStorage object in some runs.
if (typeof globalThis.localStorage?.getItem !== 'function') {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: createStorageMock(),
    writable: true,
  });
}

if (typeof globalThis.sessionStorage?.getItem !== 'function') {
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: createStorageMock(),
    writable: true,
  });
}

// 将 React 设置为全局变量，这样就不需要在每个测试文件中导入它了
(global as any).React = React;
