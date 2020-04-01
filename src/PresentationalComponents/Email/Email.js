import React, { useState, useEffect } from 'react';
import './email.scss';
import { useSelector, useDispatch } from 'react-redux';
import { formFieldsMapper, layoutMapper } from '@data-driven-forms/pf4-component-mapper';
import { Main, PageHeader, PageHeaderTitle, Skeleton } from '@redhat-cloud-services/frontend-components';
import { isEmpty } from 'lodash';
import {
    Button,
    Card,
    CardBody,
    Stack,
    StackItem,
    Flex,
    FlexItem,
    FlexModifiers,
    CardHeader,
    TextContent,
    Text,
    TextVariants,
    Spinner,
    Bullseye
} from '@patternfly/react-core';
import FormRender from '@data-driven-forms/react-form-renderer';
import PropTypes from 'prop-types';
import { DESCRIPTIVE_CHECKBOX, DATA_LIST, LOADER, DescriptiveCheckbox, DataListLayout, Loader } from '../../SmartComponents/FormComponents';
import config from '../../config.json';
import { emailPreferences, register } from '../../store';
import { saveEmailValues } from '../../actions';
import { calculateEmailConfig, getSection } from '../../Utilities/functions';

const FormButtons = ({ pristine, dirtyFieldsSinceLastSubmit, submitSucceeded, reset }) => {
    const noChanges = isEmpty(dirtyFieldsSinceLastSubmit) || !submitSucceeded && pristine;
    return (
        <div>
            <Button
                className="pref-email__form-button"
                type="submit"
                isDisabled={ noChanges }
                variant="primary">Submit</Button>
            <Button
                variant="link"
                isDisabled={ noChanges }
                onClick={ () => reset() }>
                Cancel
            </Button>
        </div>
    );
};

FormButtons.propTypes = {
    reset: PropTypes.func,
    dirtyFieldsSinceLastSubmit: PropTypes.Object,
    onCancel: PropTypes.func,
    pristine: PropTypes.bool,
    submitSucceeded: PropTypes.bool
};

const Email = () => {
    const [ emailConfig, setEmailConfig ] = useState({});
    const [ currentUser, setCurrentUser ] = useState({});
    const [ isLoaded, setLoaded ] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            register(emailPreferences);
            const { identity } = await insights.chrome.auth.getUser();
            setCurrentUser(identity.user);
            setEmailConfig((await calculateEmailConfig(config, dispatch)));
            setLoaded(true);
        })();
    }, []);

    const store = useSelector(({ emailPreferences }) => emailPreferences);

    // eslint-disable-next-line no-unused-vars
    const saveValues = ({ unsubscribe, ...values }) => {
        Object.entries(emailConfig)
        .filter(([ , { isVisible }]) => isVisible === true)
        .forEach(([ application, { localFile, schema, url }]) => {
            if (!localFile && !schema && store?.[application]?.schema && Object.keys(store?.[application]?.schema).length > 0) {
                dispatch(saveEmailValues({ application, values, url }));
            }
        });
    };

    const calculateSection = (key, schema) => {
        return getSection(key, schema, store?.[key], (isVisible) => {
            const { [key]: currSchema, ...rest } = emailConfig;
            setEmailConfig({
                ...isVisible && { [key]: {
                    ...currSchema,
                    isVisible
                }},
                ...rest
            });
        });
    };

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title='Email preferences'/>
            </PageHeader>
            <Main className="pref-email">
                <Stack gutter="md">
                    <StackItem>
                        <Card className="pref-email__info">
                            <CardHeader className="pref-email__info-head">
                                <TextContent>
                                    <Text component={ TextVariants.h2 }>Your information</Text>
                                </TextContent>
                            </CardHeader>
                            <CardBody>
                                <Flex>
                                    <FlexItem
                                        className="pref-u-bold"
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
                                    <a
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        href={ `https://www.${insights.chrome.isBeta ? 'qa.' : ''}redhat.com/wapps/ugc/protected/personalInfo.html` }>
                                        Not correct?
                                    </a>
                                </Flex>
                            </CardBody>
                        </Card>
                    </StackItem>
                    <StackItem>
                        <Card>
                            <CardHeader className="pref-email__info-head pref-email__subs-info">
                                <TextContent>
                                    <Text component={ TextVariants.h2 }>Email subscriptions</Text>
                                </TextContent>
                                <div className="pref-email_subheader">Select the cloud.redhat.com emails you want to receive.</div>
                            </CardHeader>
                            <CardBody className="pref-email_form">
                                {isLoaded ? <FormRender
                                    formFieldsMapper={ {
                                        ...formFieldsMapper,
                                        [DESCRIPTIVE_CHECKBOX]: DescriptiveCheckbox,
                                        [LOADER]: Loader,
                                        [DATA_LIST]: DataListLayout
                                    } }
                                    layoutMapper={ layoutMapper }
                                    schema={ {
                                        fields: [{
                                            name: 'email-preferences',
                                            component: DATA_LIST,
                                            sections: Object.entries(emailConfig)
                                            .map(([ key, schema ]) => calculateSection(key, schema))
                                        }]
                                    } }
                                    renderFormButtons={ props => <FormButtons { ...props } /> }
                                    onSubmit={ saveValues }
                                /> : <Bullseye>
                                    <Spinner />
                                </Bullseye>}
                            </CardBody>
                        </Card>
                    </StackItem>
                </Stack>
            </Main>
        </React.Fragment>
    );
};

export default Email;
