export const getNavFromURL = (location, navigate, fields, defaults) => {
  const searchParams = new URLSearchParams(location?.search);
  const params = Object.fromEntries(searchParams);

  if (
    fields.some(
      (bundle) =>
        bundle.name === params.bundle &&
        bundle.fields.some((app) => app.name === params.app)
    )
  ) {
    return params;
  } else {
    if (defaults.bundle && defaults.app) {
      searchParams.set('bundle', defaults.bundle);
      searchParams.set('app', defaults.app);
      navigate(
        {
          pathname: location.pathname,
          search: searchParams.toString(),
        },
        { replace: true }
      );
    }
    return { ...params, ...defaults };
  }
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
