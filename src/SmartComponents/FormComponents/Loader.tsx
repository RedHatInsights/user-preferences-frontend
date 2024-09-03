import React from 'react';
import { Skeleton } from '@redhat-cloud-services/frontend-components/Skeleton';

export type LoaderProps = {
  FieldProvider: any,
  formOptions: any,
  FormSpyProvider: any,
  validate: any,
  name: string,
  size: any,
}

const Loader = ({
  name = '',
  size = 'md',
  FieldProvider,
  validate,
  FormSpyProvider,
  formOptions,
  ...rest
}: LoaderProps) => {
  return (<div {...rest}>
    <Skeleton size={size}></Skeleton>
  </div>)
}

export default Loader;
