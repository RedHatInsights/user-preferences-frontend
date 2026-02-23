import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Loader from './Loader';

const meta: Meta<typeof Loader> = {
  title: 'Components/Form Components/Loader',
  component: Loader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Loader** is a simple loading skeleton component used in forms while data is being fetched.

## Usage
Use this component to show a loading state in forms before the actual field is rendered.
It accepts a size prop to control the skeleton height.

## Props
- \`size\`: Controls the skeleton size ('sm', 'md', 'lg')
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the skeleton loader',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Small: Story = {
  args: {
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small loader skeleton for compact form fields.',
      },
    },
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium loader skeleton - the default size for most form fields.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large loader skeleton for larger form sections or content areas.',
      },
    },
  },
};
