import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FormRenderer, componentTypes } from '@data-driven-forms/react-form-renderer';
import { componentMapper, FormTemplate } from '@data-driven-forms/pf4-component-mapper';
import { fn } from 'storybook/test';
import FormButtons from './FormButtons';

const meta: Meta<typeof FormButtons> = {
  title: 'Components/Shared/FormButtons',
  component: FormButtons,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**FormButtons** displays Save and Cancel buttons at the bottom of forms.

## Usage
This component automatically shows or hides based on form state:
- Hidden when form is pristine (no changes)
- Shown when form has unsaved changes
- Disabled after successful submit until new changes are made

## Integration
Must be used within a Data-Driven Forms \`FormRenderer\` as it relies on \`FormSpy\` to track form state.

## Behavior
- **Save button**: Submits the form (only enabled when there are changes)
- **Cancel button**: Resets form to initial values (only enabled when there are changes)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormButtons>;

export const NoChanges: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <FormRenderer
        schema={{
          fields: [
            {
              component: componentTypes.TEXT_FIELD,
              name: 'exampleField',
              label: 'Example Field',
              helperText: 'Make changes to see the form buttons appear',
            },
            {
              component: 'form-buttons',
              name: 'form-buttons',
            },
          ],
        }}
        componentMapper={{
          ...componentMapper,
          'form-buttons': FormButtons,
        }}
        FormTemplate={FormTemplate}
        onSubmit={fn()}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons are hidden when the form is pristine (no changes made). Try typing in the field to see them appear.',
      },
    },
  },
};

export const WithChanges: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <FormRenderer
        schema={{
          fields: [
            {
              component: componentTypes.TEXT_FIELD,
              name: 'exampleField',
              label: 'Example Field',
              helperText: 'This field has been modified - buttons are shown',
            },
            {
              component: 'form-buttons',
              name: 'form-buttons',
            },
          ],
        }}
        componentMapper={{
          ...componentMapper,
          'form-buttons': FormButtons,
        }}
        FormTemplate={FormTemplate}
        initialValues={{
          exampleField: 'Initial value - modify this to enable buttons',
        }}
        onSubmit={fn()}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons are enabled when the form has unsaved changes. Modify the text field to see the buttons.',
      },
    },
  },
};

export const AfterSubmit: Story = {
  render: () => {
    const [submitCount, setSubmitCount] = React.useState(0);

    return (
      <div style={{ padding: '20px' }}>
        <p style={{ marginBottom: '1rem' }}>
          Submit count: {submitCount}
          <br />
          <em>After submitting, buttons hide until new changes are made</em>
        </p>
        <FormRenderer
          schema={{
            fields: [
              {
                component: componentTypes.TEXT_FIELD,
                name: 'exampleField',
                label: 'Example Field',
              },
              {
                component: 'form-buttons',
                name: 'form-buttons',
              },
            ],
          }}
          componentMapper={{
            ...componentMapper,
            'form-buttons': FormButtons,
          }}
          FormTemplate={FormTemplate}
          initialValues={{
            exampleField: 'Make a change and click Save',
          }}
          onSubmit={(values) => {
            setSubmitCount(submitCount + 1);
            fn()(values);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'After a successful submit, buttons are hidden until new changes are made to the form.',
      },
    },
  },
};
