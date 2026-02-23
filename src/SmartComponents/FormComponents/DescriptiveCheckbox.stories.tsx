import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FormRenderer, componentTypes } from '@data-driven-forms/react-form-renderer';
import { componentMapper, FormTemplate } from '@data-driven-forms/pf4-component-mapper';
import { fn } from 'storybook/test';
import DescriptiveCheckbox from './DescriptiveCheckbox';

const meta: Meta<typeof DescriptiveCheckbox> = {
  title: 'Components/Form Components/DescriptiveCheckbox',
  component: DescriptiveCheckbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**DescriptiveCheckbox** is an enhanced checkbox component with support for descriptions, warnings, and info messages.

## Usage
Use this component for checkboxes that need additional context or conditional messaging:
- Show warnings when checked
- Show info messages when unchecked
- Provide detailed descriptions
- Trigger custom logic on change with \`afterChange\`

## Features
- **Description**: Always-visible text below the checkbox label
- **Checked Warning**: Shows warning icon and message when checkbox is checked
- **Info Message**: Shows info icon and message when checkbox is unchecked
- **After Change**: Callback function that runs after the checkbox state changes

## Integration
Must be used within a Data-Driven Forms \`FormRenderer\` as it uses \`useFieldApi\` and \`useFormApi\` hooks.

## Props
- \`label\` / \`title\`: Checkbox label text
- \`description\`: Supporting text shown below the label
- \`checkedWarning\`: Warning message shown when checked
- \`infoMessage\`: Info message shown when unchecked
- \`afterChange\`: Callback function receiving (formOptions, isChecked)
- \`disabled\`: Disables the checkbox
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DescriptiveCheckbox>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <FormRenderer
        schema={{
          fields: [
            {
              component: 'descriptive-checkbox',
              name: 'defaultCheckbox',
              label: 'Enable notifications',
              description: 'Receive email notifications for important events',
            },
          ],
        }}
        componentMapper={{
          ...componentMapper,
          'descriptive-checkbox': DescriptiveCheckbox,
        }}
        FormTemplate={FormTemplate}
        onSubmit={fn()}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default unchecked state with a label and description.',
      },
    },
  },
};

export const CheckedWithWarning: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <FormRenderer
        schema={{
          fields: [
            {
              component: 'descriptive-checkbox',
              name: 'warningCheckbox',
              label: 'Receive all notifications',
              description: 'Get notified about every event in your organization',
              checkedWarning: 'This may result in a high volume of emails',
            },
          ],
        }}
        componentMapper={{
          ...componentMapper,
          'descriptive-checkbox': DescriptiveCheckbox,
        }}
        FormTemplate={FormTemplate}
        initialValues={{
          warningCheckbox: true,
        }}
        onSubmit={fn()}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows a warning message with icon when the checkbox is checked. Useful for potentially risky or high-impact options.',
      },
    },
  },
};

export const UncheckedWithInfo: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <FormRenderer
        schema={{
          fields: [
            {
              component: 'descriptive-checkbox',
              name: 'infoCheckbox',
              label: 'Daily digest',
              description: 'Combine multiple notifications into a single daily email',
              infoMessage: 'You will receive individual emails for each event',
            },
          ],
        }}
        componentMapper={{
          ...componentMapper,
          'descriptive-checkbox': DescriptiveCheckbox,
        }}
        FormTemplate={FormTemplate}
        onSubmit={fn()}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows an info message with icon when the checkbox is unchecked. Useful for explaining the consequence of not enabling an option.',
      },
    },
  },
};

export const BothWarningAndInfo: Story = {
  render: () => {
    const [isChecked, setIsChecked] = React.useState(false);

    return (
      <div style={{ padding: '20px' }}>
        <p style={{ marginBottom: '1rem' }}>
          Current state: <strong>{isChecked ? 'Checked (warning visible)' : 'Unchecked (info visible)'}</strong>
          <br />
          <em>Toggle the checkbox to see the message change</em>
        </p>
        <FormRenderer
          schema={{
            fields: [
              {
                component: 'descriptive-checkbox',
                name: 'toggleCheckbox',
                label: 'Instant notifications',
                description: 'Control how quickly you receive notifications',
                checkedWarning: 'Notifications will be sent immediately, which may be disruptive',
                infoMessage: 'Notifications will be grouped and sent periodically',
                afterChange: (formOptions: any, checked: boolean) => {
                  setIsChecked(checked);
                  fn()(formOptions, checked);
                },
              },
            ],
          }}
          componentMapper={{
            ...componentMapper,
            'descriptive-checkbox': DescriptiveCheckbox,
          }}
          FormTemplate={FormTemplate}
          onSubmit={fn()}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates both warning (when checked) and info (when unchecked) messages. Also shows the afterChange callback in action.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <FormRenderer
        schema={{
          fields: [
            {
              component: 'descriptive-checkbox',
              name: 'disabledCheckbox',
              label: 'Email notifications (unavailable)',
              description: 'Email notifications require a verified email address',
              disabled: true,
              infoMessage: 'Verify your email address to enable this feature',
            },
          ],
        }}
        componentMapper={{
          ...componentMapper,
          'descriptive-checkbox': DescriptiveCheckbox,
        }}
        FormTemplate={FormTemplate}
        onSubmit={fn()}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state - useful when a checkbox option is not available due to missing prerequisites or permissions.',
      },
    },
  },
};

export const MultipleCheckboxes: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <FormRenderer
        schema={{
          fields: [
            {
              component: 'descriptive-checkbox',
              name: 'emailNotifications',
              label: 'Email notifications',
              description: 'Receive notifications via email',
            },
            {
              component: 'descriptive-checkbox',
              name: 'browserNotifications',
              label: 'Browser notifications',
              description: 'Show desktop notifications in your browser',
              checkedWarning: 'Requires browser permission',
            },
            {
              component: 'descriptive-checkbox',
              name: 'mobileNotifications',
              label: 'Mobile push notifications',
              description: 'Send push notifications to the mobile app',
              disabled: true,
              infoMessage: 'Install the mobile app to enable',
            },
          ],
        }}
        componentMapper={{
          ...componentMapper,
          'descriptive-checkbox': DescriptiveCheckbox,
        }}
        FormTemplate={FormTemplate}
        initialValues={{
          browserNotifications: true,
        }}
        onSubmit={fn()}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple checkboxes in a form, demonstrating different states and messages.',
      },
    },
  },
};
