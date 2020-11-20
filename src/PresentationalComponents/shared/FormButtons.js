import React from 'react';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { isEmpty } from 'lodash';
import { FormSpy } from '@data-driven-forms/react-form-renderer';
import { ActionGroup } from '@patternfly/react-core';

const FormButtons = ({ dirtyFieldsSinceLastSubmit, submitSucceeded, pristine }) => {
    const { reset } = useFormApi();
    const noChanges = isEmpty(dirtyFieldsSinceLastSubmit) || !submitSucceeded && pristine;
    return (<ActionGroup>
        <Button
            className="pref-email__form-button"
            type="submit"
            ouiaId="user-pref-primary-button"
            isDisabled={ noChanges }
            variant="primary">Save</Button>
        <Button
            variant="link"
            ouiaId="user-pref-reset-button"
            isDisabled={ noChanges }
            onClick={ () => reset() }>
            Cancel
        </Button>
    </ActionGroup>
    );
};

FormButtons.propTypes = {
    dirtyFieldsSinceLastSubmit: PropTypes.arrayOf(PropTypes.shape({
        [PropTypes.string]: PropTypes.oneOfType([ PropTypes.string, PropTypes.number, PropTypes.bool ])
    })),
    submitSucceeded: PropTypes.bool,
    pristine: PropTypes.bool
};

const FormButtonWithSpies = (formProps) => (
    <FormSpy subscription={ {
        pristine: true,
        submitSucceeded: true,
        dirtyFieldsSinceLastSubmit: true
    } }>
        { (props) => <FormButtons { ...props } { ...formProps }/> }
    </FormSpy>
);

export default FormButtonWithSpies;
