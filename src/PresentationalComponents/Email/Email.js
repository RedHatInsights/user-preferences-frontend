import React, { useState, useEffect } from 'react';
import './email.scss';
import { formFieldsMapper, layoutMapper } from '@data-driven-forms/pf4-component-mapper';
import { Main, PageHeader, PageHeaderTitle, Skeleton } from '@redhat-cloud-services/frontend-components';
import { Button, Card, CardBody, Stack, StackItem, Flex, FlexItem, FlexModifiers, CardHeader } from '@patternfly/react-core';
import FormRender from '@data-driven-forms/react-form-renderer';
import PropTypes from 'prop-types';
import { DESCRIPTIVE_CHECKBOX, DescriptiveCheckbox } from '../../SmartComponents/FormComponents';

const FormButtons = ({ submitting, valid, pristine, onCancel }) => (
    <div>
        <Button
            type="submit"
            isDisabled={ submitting || !valid }
            style={ { marginRight: 16 } }
            variant="primary">Save</Button>
        <Button
            variant="link"
            isDisabled={ pristine }
            onClick={ onCancel }>Cancel</Button>
    </div>
);

FormButtons.propTypes = {
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    valid: PropTypes.bool,
    onCancel: PropTypes.func
};

const Email = () => {

    const [ currentUser, setCurrentUser ] = useState({});
    const [ isLoaded, setLoaded ] = useState(false);

    useEffect(() => {
        insights.chrome.auth.getUser().then(
            (data) => {
                setCurrentUser(data.identity.user);
                setLoaded(true);
            }
        );
    }, []);

    const schema = {
        fields: []
    };

    const saveValues = (values) => {
        console.log(values);
    };

    const cancelEmail = () => {
        console.log('cancel pressed');
    };

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title='Email preferences'/>
            </PageHeader>
            <Main className="pref-email">
                <Stack gutter="md">
                    <StackItem>
                        <Card>
                            <CardHeader className="pref-email_head">Your information</CardHeader>
                            <CardBody>
                                <Flex>
                                    <FlexItem
                                        className="pref-email_bold"
                                        breakpointMods={ [{ modifier: FlexModifiers['spacer-3xl'] }] }>
                                        Email address
                                    </FlexItem>
                                    <FlexItem className="pref-email_loader" breakpointMods={ [{ modifier: FlexModifiers['spacer-md'] }] }>
                                        { isLoaded ? (
                                            <span>{currentUser.email}</span>
                                        ) : (
                                            <Skeleton size='lg'></Skeleton>
                                        )}
                                    </FlexItem>
                                    <a href='#'>Not correct?</a>
                                </Flex>
                            </CardBody>
                        </Card>
                    </StackItem>
                    <StackItem>
                        <Card>
                            <CardHeader className="pref-email_head">
                                <div>Email subscriptions</div>
                                <div className="pref-email_subheader">Select the cloud.redhat.com emails you want to receive.</div>
                            </CardHeader>
                            <CardBody>
                                <FormRender
                                    formFieldsMapper={ {
                                        ...formFieldsMapper,
                                        [DESCRIPTIVE_CHECKBOX]: DescriptiveCheckbox
                                    } }
                                    layoutMapper={ layoutMapper }
                                    schema={ schema }
                                    renderFormButtons={ props => <FormButtons { ...props } onCancel={ cancelEmail } /> }
                                    onSubmit={ saveValues }
                                />
                            </CardBody>
                        </Card>
                    </StackItem>
                </Stack>
            </Main>
        </React.Fragment>
    );
};

export default Email;
