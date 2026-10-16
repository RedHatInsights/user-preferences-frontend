import { defineMessages, injectIntl } from 'react-intl';
import React, { Component } from 'react';
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';

class DataListRowBase extends Component {
  state = {
    hasError: false,
  };

  componentDidCatch(_error, info) {
    this.setState({ hasError: info });
  }

  render() {
    const { fieldsKey, label, fields, formOptions } = this.props;
    const { hasError } = this.state;
    return (
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell
              isFilled={false}
              className="pref-c-title pref-u-bold"
              key={`${fieldsKey}-title`}
            >
              {fieldsKey === 0 ? label : ''}
            </DataListCell>,
            <DataListCell isFilled key={`${fieldsKey}-content`}>
              {hasError
                ? this.props.intl.formatMessage(messages.mappingError)
                : formOptions?.renderForm(fields, formOptions)}
            </DataListCell>,
          ]}
        />
      </DataListItemRow>
    );
  }
}

DataListRowBase.propTypes = {
  fieldsKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fields: PropTypes.array,
  FieldProvider: PropTypes.any,
  formOptions: PropTypes.any,
  label: PropTypes.node,
  name: PropTypes.string,
  validate: PropTypes.any,
  FormSpyProvider: PropTypes.any,
  intl: PropTypes.object,
};

// eslint-disable-next-line no-unused-vars

const messages = defineMessages({
  mappingError: {
    id: 'userPrefs.dataList.mappingError',
    defaultMessage:
      'Error while mapping fields, please check your schema if it has valid component types',
  },
});

const DataListRow = injectIntl(DataListRowBase);

const DataListLayout = (props) => {
  const { sections, label, name } = useFieldApi(props);
  const formOptions = useFormApi();
  return (
    <DataList aria-label={label || name} {...props}>
      {sections.map(({ label, fields }, key) => {
        const actualFields = Array.isArray(fields) ? fields : [fields];
        return (
          actualFields.length > 0 && (
            <DataListItem name={name} key={key} aria-labelledby="simple-item1">
              {actualFields.map(({ fields: fieldsToRender }, fieldsKey) => (
                <DataListRow
                  key={`${key}-${fieldsKey}`}
                  fieldsKey={fieldsKey}
                  label={label}
                  fields={fieldsToRender}
                  formOptions={formOptions}
                />
              ))}
            </DataListItem>
          )
        );
      })}
    </DataList>
  );
};

DataListLayout.propTypes = {
  sections: PropTypes.array,
  FieldProvider: PropTypes.any,
  formOptions: PropTypes.any,
  label: PropTypes.node,
  name: PropTypes.string,
  validate: PropTypes.any,
  FormSpyProvider: PropTypes.any,
};

export default DataListLayout;
