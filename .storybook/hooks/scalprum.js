// Mock @scalprum/react-core for Storybook (no module federation share scope).
import React from 'react';

export function ScalprumProvider({ children }) {
  return React.createElement(React.Fragment, null, children);
}

export const ScalprumComponent = () => null;

export const useLoadModule = () => [null];

export const useRemoteHook = () => ({
  hookResult: null,
  loading: true,
});

export default ScalprumProvider;
