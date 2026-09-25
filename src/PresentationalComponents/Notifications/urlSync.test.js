import { getNavFromURL, setNavToURL } from './urlSync';

const mockedNavigate = jest.fn();
const mockedLocation = jest.fn(() => ({}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useLocation: () => mockedLocation,
}));

describe('getNavFromURL', () => {
  afterEach(() => {
    mockedLocation.mockReset();
    mockedNavigate.mockReset();
  });

  it('should return default output', () => {
    const result = getNavFromURL(
      mockedLocation,
      mockedNavigate,
      [],
      { bundle: 'rhel', app: 'advisor' },
      false
    );
    const expected = { bundle: 'rhel', app: 'advisor' };
    expect(mockedNavigate).toBeCalledWith(
      { pathname: undefined, search: 'bundle=rhel&app=advisor' },
      { replace: true }
    );
    expect(result).toMatchObject(expected);
  });

  it('should return output from URL', () => {
    const result = getNavFromURL(
      { search: '?bundle=group&app=test' },
      mockedNavigate,
      [{ name: 'group', fields: [{ name: 'test' }] }],
      { bundle: 'rhel', app: 'advisor' },
      false
    );
    const expected = { bundle: 'group', app: 'test' };
    expect(result).toMatchObject(expected);
  });

  it('keeps a known bundle and falls back to its first app when app is missing', () => {
    const result = getNavFromURL(
      { search: '?bundle=console' },
      mockedNavigate,
      [
        { name: 'rhel', fields: [{ name: 'advisor' }] },
        { name: 'console', fields: [{ name: 'sources' }, { name: 'rbac' }] },
      ],
      { bundle: 'rhel', app: 'advisor' }
    );
    expect(mockedNavigate).toBeCalledWith(
      { pathname: undefined, search: 'bundle=console&app=sources' },
      { replace: true }
    );
    expect(result).toMatchObject({ bundle: 'console', app: 'sources' });
  });

  it('keeps a known bundle when the app is not one of its own', () => {
    const result = getNavFromURL(
      { search: '?bundle=console&app=advisor' },
      mockedNavigate,
      [
        { name: 'rhel', fields: [{ name: 'advisor' }] },
        { name: 'console', fields: [{ name: 'sources' }, { name: 'rbac' }] },
      ],
      { bundle: 'rhel', app: 'advisor' }
    );
    expect(result).toMatchObject({ bundle: 'console', app: 'sources' });
  });

  it('falls back to the defaults when the bundle is unknown', () => {
    const result = getNavFromURL(
      { search: '?bundle=nope&app=nope' },
      mockedNavigate,
      [{ name: 'rhel', fields: [{ name: 'advisor' }] }],
      { bundle: 'rhel', app: 'advisor' }
    );
    expect(result).toMatchObject({ bundle: 'rhel', app: 'advisor' });
  });
});

describe('setNavToURL', () => {
  it('should call replace with correct params', () => {
    setNavToURL({ search: '?bundle=rhel&app=advisor' }, mockedNavigate, {
      bundle: 'someBundle',
      app: 'someApp',
    });
    expect(mockedNavigate).toHaveBeenCalledWith(
      {
        pathname: undefined,
        search: 'bundle=someBundle&app=someApp',
      },
      { replace: true }
    );
  });
});
