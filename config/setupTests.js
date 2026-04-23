import React from 'react';

jest.mock('@unleash/proxy-client-react', () => ({
  useFlag: jest.fn(() => false),
}));

global.React = React;
global.insights = {
  chrome: {
    visibilityFunctions: {
      something: (...args) => Boolean(args && args.length > 0 && args[0]),
    },
    auth: {
      getUser: () => Promise.resolve({ identity: {} }),
    },
    getUserPermissions: jest.fn(),
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
