import React from 'react';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';
import { fireEvent, getByRole, render } from '@testing-library/react';
import BulkSelectButton from './BulkSelectButton';

const mockInputOnChange = jest.fn();

jest.mock('@data-driven-forms/react-form-renderer/use-field-api', () =>
  jest.fn((props) => ({
    ...props,
    input: {
      value: true,
    },
  }))
);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [new URLSearchParams()],
}));

describe('BulkSelectButton tests', () => {
  const onClickMock = jest.fn(() => mockInputOnChange());

  afterEach(() => {
    onClickMock.mockReset();
  });

  it('should render correctly', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {(props) => (
          <RendererContext.Provider
            value={{
              formOptions: {
                internalRegisterField: jest.fn(),
                internalUnRegisterField: jest.fn(),
                getState: () => ({
                  dirtyFields: [],
                }),
              },
            }}
          >
            <BulkSelectButton label="My button" {...props} />
          </RendererContext.Provider>
        )}
      </Form>
    );
    expect(container).toMatchSnapshot();
  });

  it('should toggle correctly', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {(props) => (
          <RendererContext.Provider
            value={{
              formOptions: {
                internalRegisterField: jest.fn(),
                internalUnRegisterField: jest.fn(),
                batch: (callback) => callback(),
                getRegisteredFields: () => ['rhel[advisor]', 'rhel[sources]'],
              },
            }}
          >
            <BulkSelectButton
              label="My button"
              group="rhel"
              section="sources"
              onClick={onClickMock}
              {...props}
            />
          </RendererContext.Provider>
        )}
      </Form>
    );

    fireEvent.click(getByRole(container, 'button'));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
