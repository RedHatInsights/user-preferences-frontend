import { useState } from 'react';
import useLoaded from './useLoaded';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState({});
  const { auth } = useChrome();

  const isLoaded = useLoaded(async () => {
    const { identity } = await auth.getUser();
    setCurrentUser(identity.user);
  });

  return {
    isLoaded,
    currentUser,
  };
};

export default useCurrentUser;
