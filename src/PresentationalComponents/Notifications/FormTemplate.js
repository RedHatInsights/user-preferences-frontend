import React, { useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import {
  ActionGroup,
  Bullseye,
  Button,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Flex,
  FlexItem,
  Form,
  Grid,
  GridItem,
  Menu,
  MenuContent,
  MenuGroup,
  MenuInput,
  MenuItem,
  MenuList,
  Spinner,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { ButtonVariant } from '@patternfly/react-core/dist/js/components/Button/Button';
import { menuItems } from './data';
import './notifications.scss';
import { SearchIcon } from '@patternfly/react-icons';

/**
 * This id is requried to submit form by a button outside of the form element
 */
const MODAL_FORM_IDENTIFIER = 'modal-form';
export const CustomFormWrapper = (props) => (
  <Form {...props} id={MODAL_FORM_IDENTIFIER} />
);

const CustomButtons = ({ saveLabel, cancelLabel }) => {
  const { onCancel } = useFormApi();

  return (
    <FormSpy>
      {({ pristine, invalid, validating, submitting }) => (
        <div className="pf-c-form">
          <ActionGroup className="pf-u-mt-0">
            <Button
              ouiaId="primary-save-button"
              variant="primary"
              form={MODAL_FORM_IDENTIFIER}
              type="submit"
              isDisabled={pristine || validating || submitting || invalid}
            >
              {saveLabel}
            </Button>
            <Button
              ouiaId="secondary-cancel-button"
              variant="link"
              onClick={onCancel}
              id="cancel-modal"
            >
              {cancelLabel}
            </Button>
          </ActionGroup>
        </div>
      )}
    </FormSpy>
  );
};

CustomButtons.propTypes = {
  saveLabel: PropTypes.node,
  cancelLabel: PropTypes.node,
};

CustomButtons.defaultProps = {
  saveLabel: 'Save',
  cancelLabel: 'Cancel',
};

const renderPageHeading = (bundleTitle, sectionTitle) => (
  <React.Fragment>
    <Title
      headingLevel="h3"
      size="xl"
      className="pf-u-pb-xs pf-u-mt-lg"
      style={{ paddingLeft: 0 }}
    >
      {`${sectionTitle} | ${bundleTitle}`}
    </Title>
    Configure your {sectionTitle} notifications.
  </React.Fragment>
);

const reducer = (state, action) => {
  switch (action.type) {
    case 'changeTab':
      return {
        ...state,
        bundle: action.payload.bundle,
        section: action.payload.section,
      };
    default:
      throw new Error();
  }
};

const prepareSections = (bundles, searchValue = '') =>
  Object.entries(menuItems).reduce((acc, [bundleKey, value]) => {
    const sections = [
      ...(bundles[bundleKey]?.sections?.filter(
        (section) =>
          section.name
            .toLocaleLowerCase()
            .includes(searchValue.toLocaleLowerCase()) ||
          section.label
            .toLocaleLowerCase()
            .includes(searchValue.toLocaleLowerCase())
      ) || []),
    ];
    // Add email?
    return {
      ...acc,
      ...(sections?.length > 0
        ? {
            [bundleKey]: {
              ...value,
              sections,
            },
          }
        : {}),
    };
  }, {});

//   const calculateSection = (key, schema) => {
//     return getSection(key, schema, store?.[key], (isVisible) => {
//       const { ...config } = emailConfig;
//       if (isVisible === false) {
//         delete config[key];
//       } else {
//         config[key] = {
//           ...config[key],
//           isVisible,
//         };
//       }

//       setEmailConfig(config);
//     });
//   };

export const FormTemplate = ({ schema, formFields, isLoading, title }) => {
  const { handleSubmit } = useFormApi();
  const search = useRef(null);
  const [searchValue, setSearchValue] = useState();
  const [data, setData] = useState({});
  const mastheadHeight = useRef(0);
  useEffect(() => {
    mastheadHeight.current =
      window.innerHeight -
      document
        .getElementsByClassName('pf-c-page__main')[0]
        .getBoundingClientRect().height;
    const menuElement = document.getElementById('notifications-menu');

    resizeObserver.observe(menuElement);

    return () => {
      resizeObserver.unobserve(menuElement);
    };
  }, []);

  const resizeMenu = () => {
    const content = document.getElementById('notifications-menu-content');
    content.style.maxHeight =
      window.innerWidth > 768
        ? `${Math.min(
            document
              .getElementById('notifications-menu')
              .getBoundingClientRect().height -
              search.current?.getBoundingClientRect().height -
              1,
            window.innerHeight -
              mastheadHeight.current -
              title?.getBoundingClientRect().height -
              search.current?.getBoundingClientRect().height -
              1
          )}px`
        : '30vh';
  };

  const resizeObserver = new ResizeObserver(resizeMenu);

  const initialState = {
    bundle: Object.entries(schema)?.filter(
      (entry) => entry[1]?.sections.length > 0
    )?.[0]?.[0],
    section: Object.entries(schema)?.filter(
      (entry) => entry[1]?.sections.length > 0
    )?.[0]?.[1]?.sections[0].name,
  };
  const [state, change] = useReducer(reducer, initialState);

  useEffect(() => {
    setData(prepareSections(schema, searchValue));
  }, [schema, searchValue]);

  console.log(schema, formFields);

  return (
    // <form onSubmit={handleSubmit}>
    <Grid className="pf-u-h-100 pf-u-background-color-100">
      <GridItem
        id="notifications-menu"
        className="pf-m-3-col-on-md pref-notifications--menu"
      >
        <Menu isPlain isScrollable>
          <MenuInput ref={search} className="pf-u-mx-sm">
            <TextInput
              placeholder="Search applications"
              value={searchValue}
              aria-label="Filter menu items"
              iconVariant="search"
              type="search"
              onChange={(value) => setSearchValue(value)}
            />
          </MenuInput>
          <Divider />

          <MenuContent id="notifications-menu-content">
            {Object.keys(data)?.length > 0 || isLoading ? (
              Object.entries(data).map(([key, { title, sections = [] }]) => (
                <MenuGroup key={key} label={title} className="pf-u-px-sm">
                  <MenuList>
                    {sections.map((section) => (
                      <MenuItem
                        onClick={() =>
                          change({
                            type: 'changeTab',
                            payload: { bundle: key, section: section.name },
                          })
                        }
                        itemId={section.name}
                        key={section.name}
                        className="pf-u-px-sm"
                      >
                        {section.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </MenuGroup>
              ))
            ) : (
              <EmptyState
                variant={EmptyStateVariant.small}
                className="pf-u-mt-lg"
              >
                <EmptyStateIcon icon={SearchIcon} />
                <Title headingLevel="h4" size="lg">
                  No matching applications found
                </Title>
                <EmptyStateBody>
                  Adjust you filters and try again.
                </EmptyStateBody>
                <Button
                  variant={ButtonVariant.link}
                  onClick={() => setSearchValue('')}
                >
                  Clear filters
                </Button>
              </EmptyState>
            )}
          </MenuContent>
        </Menu>
      </GridItem>
      <GridItem className="pf-m-9-col-on-md pref-notifications--section">
        {!isLoading ? (
          <Flex className="pf-u-flex-direction-column pf-u-h-100">
            <FlexItem className="pf-u-mb-xl pf-u-ml-lg">
              {renderPageHeading(
                menuItems[state.bundle]?.title,
                schema[state.bundle]?.sections.find(
                  (section) => section.name === state.section
                )?.label
              )}
              {/** Do we want it to come together with the schema? */}
            </FlexItem>
            <FlexItem className="pf-u-flex-grow-1 pf-u-ml-lg">
              {schema.title}
              {formFields}
            </FlexItem>
            <div className="pref-notifications--buttons">
              <Button variant={ButtonVariant.primary} className="pf-u-mr-sm">
                Save
              </Button>
              <Button variant={ButtonVariant.link}>Cancel</Button>
            </div>
          </Flex>
        ) : (
          <Bullseye>
            <Spinner />
          </Bullseye>
        )}
      </GridItem>
    </Grid>
    // </form>
  );
};

export default FormTemplate;
