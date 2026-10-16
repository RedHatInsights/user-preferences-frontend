import React from 'react';
import { IntlMessagesProvider, useChromeLocale } from './i18n';
import { Provider } from 'react-redux';
import App from './App';
import { RegistryContext, registry } from './Utilities/store';

const UserReferences = () => {
  const locale = useChromeLocale();

  return (
    <RegistryContext.Provider
      value={{
        getRegistry: () => registry,
      }}
    >
      <Provider store={registry.getStore()}>
        <IntlMessagesProvider locale={locale}>
          <App />
        </IntlMessagesProvider>
      </Provider>
    </RegistryContext.Provider>
  );
};

export default UserReferences;
