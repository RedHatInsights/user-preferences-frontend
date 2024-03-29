import React from 'react';
import DataListLayout from './DataListLayout';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';
import { render } from '@testing-library/react';

describe('DataListLayout checkbox tests', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {(props) => (
          <RendererContext.Provider
            value={{
              formOptions: {
                renderForm: () => null,
                internalRegisterField: () => undefined,
                internalUnRegisterField: () => undefined,
              },
            }}
          >
            <DataListLayout
              label="test label"
              sections={[{ label: 'test', fields: [{ fields: [] }] }]}
              formOptions={{
                renderForm: () => 'test',
              }}
              clearedValue
              {...props}
            />
          </RendererContext.Provider>
        )}
      </Form>
    );
    expect(container).toMatchSnapshot();
  });
});
