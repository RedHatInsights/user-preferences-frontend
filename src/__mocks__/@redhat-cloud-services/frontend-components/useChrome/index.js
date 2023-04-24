const useChrome = () => {
  const auth = {
    getUser: () => Promise.resolve({ identity: {} }),
  };

  return {
    auth,
  };
};

module.exports.useChrome = useChrome;
