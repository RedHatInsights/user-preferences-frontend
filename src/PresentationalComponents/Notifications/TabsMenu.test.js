import React from 'react';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';
import {
  fireEvent,
  getByRole,
  getByText,
  render,
} from '@testing-library/react';
import TabsMenu from './TabsMenu';

describe('TabsMenu tests', () => {
  const setSearch = jest.fn();
  const fields = [
    {
      title: 'Red Hat Enterprise Linux',
      name: 'rhel',
      fields: [
        {
          name: 'advisor',
          label: 'Advisor',
          component: 'tabGroup',
          fields: [],
          bundle: 'rhel',
        },
      ],
    },
  ];

  afterEach(() => {
    setSearch.mockReset();
  });

  it('should render empty state correctly', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {() => (
          <RendererContext.Provider
            value={{
              formOptions: {
                renderForm: () => {},
              },
            }}
          >
            <TabsMenu search="" fields={[]} isLoading={false} />
          </RendererContext.Provider>
        )}
      </Form>
    );
    expect(container).toMatchSnapshot();
  });
  it('should clear search from the empty state on click', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {() => (
          <RendererContext.Provider
            value={{
              formOptions: {
                renderForm: () => {},
              },
            }}
          >
            <TabsMenu
              search=""
              fields={[]}
              isLoading={false}
              setSearch={setSearch}
            />
          </RendererContext.Provider>
        )}
      </Form>
    );
    fireEvent.click(getByText(container, 'Clear filters'));
    expect(setSearch).toBeCalledTimes(1);
    expect(setSearch).toBeCalledWith('');
  });
  it('should render nav correctly', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {() => (
          <RendererContext.Provider
            value={{
              formOptions: {
                renderForm: () => {},
              },
            }}
          >
            <TabsMenu
              search=""
              setSearch={() => null}
              fields={fields}
              isLoading={false}
              onClick={() => null}
            />
          </RendererContext.Provider>
        )}
      </Form>
    );
    expect(container).toMatchSnapshot();
  });
  it('should set search on input typing', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {() => (
          <RendererContext.Provider
            value={{
              formOptions: {
                renderForm: () => {},
              },
            }}
          >
            <TabsMenu
              search=""
              setSearch={setSearch}
              fields={fields}
              isLoading={false}
              onClick={() => null}
            />
          </RendererContext.Provider>
        )}
      </Form>
    );
    fireEvent.change(getByRole(container, 'searchbox'), {
      target: { value: 'someText' },
    });
    expect(setSearch).toBeCalledTimes(1);
    expect(setSearch).toBeCalledWith('someText');
  });
  it('should call onClick callback correctly', () => {
    const onClick = jest.fn();
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {() => (
          <RendererContext.Provider
            value={{
              formOptions: {
                renderForm: () => {},
              },
            }}
          >
            <TabsMenu
              search=""
              fields={fields}
              isLoading={false}
              onClick={onClick}
            />
          </RendererContext.Provider>
        )}
      </Form>
    );
    fireEvent.click(getByText(container, 'Advisor'));
    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith(expect.anything(), 'rhel', 'advisor');
  });
});
