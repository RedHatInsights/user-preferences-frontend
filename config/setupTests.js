import React from 'react';

// Polyfill crypto.randomUUID for Kessel SDK (required by jsdom)
if (!global.crypto) {
  global.crypto = {};
}
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}

jest.mock('@unleash/proxy-client-react', () => ({
  useFlag: jest.fn(() => false), // Default to v1 org
}));

// Mock Kessel SDK
jest.mock('@project-kessel/react-kessel-access-check', () => ({
  AccessCheck: {
    Provider: ({ children }) => children,
  },
}));

global.React = React;
global.insights = {
  chrome: {
    visibilityFunctions: {
      something: (...args) => Boolean(args && args.length > 0 && args[0]),
    },
    auth: {
      getUser: () => Promise.resolve({ identity: {} }),
      getToken: () => Promise.resolve('mock-token-12345'),
    },
    getUserPermissions: jest.fn(() =>
      Promise.resolve([
        { permission: 'user-preferences:*:*', resourceDefinitions: [] },
      ])
    ),
    // Mock v2 properties
    _isRbacV2Org: false,
    _kesselPermissions: [],
    _kesselMappedPermissions: [],
  },
};
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
global.document.getElementById = jest.fn(() => ({
  getBoundingClientRect: jest.fn(() => ({ width: 100 })),
}));
