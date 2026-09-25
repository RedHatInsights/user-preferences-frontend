export const getNavFromURL = (location, navigate, fields, defaults) => {
  const searchParams = new URLSearchParams(location?.search);
  const params = Object.fromEntries(searchParams);

  const bundle = fields.find((item) => item.name === params.bundle);
  const app = bundle?.fields?.find((item) => item.name === params.app);

  if (bundle && app) {
    return params;
  }

  // Callers such as the notifications drawer can deep link with a known bundle
  // but no (or an unknown) app. Keep the bundle they asked for and fall back to
  // its first app, rather than resetting to the first bundle in the list.
  const resolved = {
    bundle: bundle?.name ?? defaults.bundle,
    app: bundle?.fields?.[0]?.name ?? defaults.app,
  };

  if (resolved.bundle && resolved.app) {
    searchParams.set('bundle', resolved.bundle);
    searchParams.set('app', resolved.app);
    navigate(
      {
        pathname: location.pathname,
        search: searchParams.toString(),
      },
      { replace: true }
    );
  }
  return { ...params, ...resolved };
};

export const setNavToURL = (location, navigate, params) => {
  let searchParams = new URLSearchParams(location?.search);
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });

  navigate(
    {
      pathname: location.pathname,
      search: searchParams.toString(),
    },
    { replace: true }
  );
};
