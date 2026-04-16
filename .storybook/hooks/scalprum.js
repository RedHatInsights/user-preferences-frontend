// Mock @scalprum/react-core for Storybook
// Scalprum uses Module Federation which is not available in Storybook
import React from 'react';

export const ScalprumComponent = () => null;

export const useLoadModule = () => [null];

export const useRemoteHook = () => ({
  hookResult: null,
  loading: true,
});
